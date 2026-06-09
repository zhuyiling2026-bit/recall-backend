import { Router } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

const DEFAULTS = [
  { key: 'education', label: 'Learn' },
  { key: 'business', label: 'Career' },
  { key: 'entertainment', label: 'Fun' },
  { key: 'health', label: 'Life' },
  { key: 'travel', label: 'Travel' },
  { key: 'lifestyle', label: 'Lifestyle' },
];

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('key, label, sort_order')
      .eq('user_id', req.userId)
      .order('sort_order');

    if (error) {
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    if (!data || data.length === 0) {
      return res.json(DEFAULTS.map((c, i) => ({ ...c, sort_order: i })));
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const cats = req.body;
    if (!Array.isArray(cats)) {
      return res.status(400).json({ error: 'Body must be an array of { key, label }' });
    }

    const valid = cats
      .filter((c) => c.key && c.label && !c.key.startsWith('__'))
      .map((c, i) => ({
        user_id: req.userId,
        key: c.key.toLowerCase().replace(/\s+/g, '_'),
        label: c.label.trim(),
        sort_order: i,
      }));

    if (valid.length === 0) {
      return res.status(400).json({ error: 'At least one valid category required' });
    }

    // Transaction: delete all, then insert new set
    const { error: delErr } = await supabase
      .from('categories')
      .delete()
      .eq('user_id', req.userId);

    if (delErr) {
      return res.status(500).json({ error: `Database error: ${delErr.message}` });
    }

    const { data, error: insErr } = await supabase
      .from('categories')
      .insert(valid)
      .select('key, label, sort_order')
      .order('sort_order');

    if (insErr) {
      return res.status(500).json({ error: `Database error: ${insErr.message}` });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
