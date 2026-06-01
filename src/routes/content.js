import { Router } from 'express';
import { parse } from 'node-html-parser';
import { analyzeContent } from '../services/claude.js';
import { supabase } from '../services/supabase.js';

const router = Router();

router.post('/import', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }

    // Fetch the page content
    let html;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(422).json({ error: `Failed to fetch URL: ${response.status}` });
      }
      html = await response.text();
    } catch {
      return res.status(422).json({ error: 'Failed to fetch URL' });
    }

    // Extract text from HTML
    const root = parse(html);
    root.querySelectorAll('script, style, noscript').forEach(el => el.remove());
    const text = root.textContent.replace(/\s+/g, ' ').trim();

    if (!text) {
      return res.status(422).json({ error: 'No text content found at URL' });
    }

    // Analyze with AI — return preview only, do not save
    const analysis = await analyzeContent(text);
    res.json({ url, ...analysis });
  } catch (err) {
    next(err);
  }
});

router.post('/confirm', async (req, res, next) => {
  try {
    const { url, title, summary, category, tags } = req.body;

    const { data, error } = await supabase
      .from('contents')
      .insert({ url, title, summary, category, tags })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/list', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['read', 'deleted'].includes(status)) {
      return res.status(400).json({ error: 'status must be "read" or "deleted"' });
    }

    const { data, error } = await supabase
      .from('contents')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
