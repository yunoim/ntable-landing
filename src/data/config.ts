// Zod schemas for src/content/{locale}/*.yml
//
// Validated at load time by src/lib/loadContent.ts (added in STEP 2).
// Astro's defineCollection() is intentionally not used: the per-locale
// directory layout (src/content/{locale}/{name}.yml) does not map to
// Astro's one-schema-per-collection model. We validate per-file in the loader.

import { z } from 'zod';

// ─────────────────────────────── shared building blocks ───────────────────────────────

const link = z.object({
  label: z.string(),
  href: z.string(),
});

const cta = z.object({
  label: z.string(),
  href: z.string(),
  event: z.string(),
});

const sectionCta = cta.extend({
  note: z.string(),
});

// Title/body split pattern: prefix + <em>emphasis</em> + suffix.
// Line breaks are encoded as literal "\n" in prefix/suffix strings; the
// template converts "\n" to <br>.
const titleWithEmphasis = z.object({
  prefix: z.string(),
  emphasis: z.string().optional(),
  suffix: z.string().optional(),
});

// Inline body with highlighted strong segment: before + <strong>highlight</strong> + after
const highlightedBody = z.object({
  before: z.string(),
  highlight: z.string(),
  after: z.string(),
});

// ─────────────────────────────── meta.yml ───────────────────────────────

export const metaSchema = z.object({
  lang: z.string(),
  locale: z.string(),
  site: z.string().url(),
  title: z.string(),
  description: z.string(),
  canonical: z.string().url(),
  og: z.object({
    type: z.string(),
    url: z.string().url(),
    title: z.string(),
    description: z.string(),
    image: z.string().url(),
    image_width: z.number().int(),
    image_height: z.number().int(),
    site_name: z.string(),
  }),
  twitter: z.object({
    card: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string().url(),
  }),
  organization: z.object({
    name: z.string(),
    slogan: z.string(),
    url: z.string().url(),
    logo: z.string().url(),
    email: z.string().email(),
    description: z.string(),
    same_as: z.array(z.string().url()),
  }),
});

// ─────────────────────────────── nav.yml ───────────────────────────────

export const navSchema = z.object({
  logo: z.string(),
  logo_href: z.string(),
  cta: cta,
  links: z.array(link),
  mobile_extra_links: z.array(link),
});

// ─────────────────────────────── hero.yml ───────────────────────────────

export const heroSchema = z.object({
  eyebrow: z.string(),
  title: titleWithEmphasis,
  subtitle: z.string(),
  cta: z.object({
    primary: cta,
    secondary: cta,
  }),
  trust_chips: z.array(z.string()),
  live_badge: z.object({
    href: z.string().url(),
    event: z.string(),
    initial_text: z.string(),
    empty_html: z.string(),
    live_template_html: z.string(),
    error_text: z.string(),
  }),
  mockup: z.object({
    code: z.string(),
    status_label: z.string(),
    presence_count: z.number().int(),
    presence_label: z.string(),
    cta: z.object({
      href: z.string().url(),
      event: z.string(),
      hint: z.string(),
      aria_label: z.string(),
    }),
    phases: z.array(z.object({
      num: z.string(),
      label: z.string(),
      state: z.enum(['done', 'active']).optional(),
    })),
    participants: z.array(z.object({
      initial: z.string(),
      name: z.string(),
      is_host: z.boolean().optional(),
      host_label: z.string().optional(),
    })),
    stats_row: z.array(z.object({
      icon: z.string(),
      text_html: z.string(),
    })),
    vote: z.object({
      meta: z.string(),
      question: z.string(),
      options: z.array(z.object({
        code: z.string(),
        label: z.string(),
        pct: z.number().int(),
      })),
    }),
  }),
  scroll_indicator: z.object({
    href: z.string(),
    aria_label: z.string(),
  }),
});

// ─────────────────────────────── stats.yml ───────────────────────────────

export const statsSchema = z.object({
  badge: z.string(),
  live_widget: z.object({
    api: z.string().url(),
    refresh_ms: z.number().int().positive(),
    meta_refresh_ms: z.number().int().positive(),
    rooms_label: z.string(),
    people_label: z.string(),
    cumulative_template_html: z.string(),
  }),
  cards: z.array(z.object({
    number: z.string(),
    label_html: z.string(),
  })),
});

// ─────────────────────────────── problems.yml ───────────────────────────────

export const problemsSchema = z.object({
  section_tag: z.string(),
  title: titleWithEmphasis,
  body: z.string(),
  cards: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    body: z.string(),
    example: z.string(),
  })),
});

// ─────────────────────────────── solutions.yml ───────────────────────────────

export const solutionsSchema = z.object({
  section_tag: z.string(),
  title: titleWithEmphasis,
  body: z.string(),
  steps: z.array(z.object({
    num: z.string(),
    title: z.string(),
    body: z.string(),
  })),
  cta: sectionCta,
});

// ─────────────────────────────── how.yml ───────────────────────────────

export const howSchema = z.object({
  section_tag: z.string(),
  title: z.string(),
  body: z.string(),
  steps: z.array(z.object({
    phase: z.string(),
    subphase: z.string(),
    title: z.string(),
    body: z.string(),
    tags: z.array(z.string()),
  })),
});

// ─────────────────────────────── model.yml ───────────────────────────────

const compareCell = z.object({
  mark: z.string(),
  text: z.string(),
  note: z.string().optional(),
});

export const modelSchema = z.object({
  section_tag: z.string(),
  title: titleWithEmphasis,
  body: z.string(),
  plan_card: z.object({
    eyebrow: z.string(),
    title: z.string(),
    body: z.string(),
    features: z.array(z.string()),
  }),
  compare: z.object({
    title: titleWithEmphasis,
    subtitle: z.string(),
    me_label: z.string(),
    competitors: z.array(z.string()),
    rows: z.array(z.object({
      axis: z.string(),
      me: compareCell,
      values: z.array(compareCell),
    })),
    footnote: z.string(),
  }),
  cta: sectionCta,
});

// ─────────────────────────────── expansion.yml ───────────────────────────────

export const expansionSchema = z.object({
  section_tag: z.string(),
  title: z.string(),
  body: highlightedBody,
  engine_hub: z.object({
    eyebrow: z.string(),
    title: titleWithEmphasis,
    arrow: z.string(),
  }),
  packs: z.array(z.object({
    emoji: z.string(),
    title: z.string(),
    body: z.string(),
    status: z.string().optional(),
  })),
  toolkit: z.object({
    title: z.string(),
    body: z.string(),
    items: z.array(z.object({
      horizon: z.string(),
      title: z.string(),
      body: z.string(),
      status: z.string(),
    })),
  }),
});

// ─────────────────────────────── roadmap.yml ───────────────────────────────

export const roadmapSchema = z.object({
  section_tag: z.string(),
  title: z.string(),
  phases: z.array(z.object({
    label: z.string(),
    label_has_dot: z.boolean().optional(),
    phase_num: z.string(),
    state: z.enum(['active']).optional(),
    title: z.string(),
    body: z.string(),
    tags: z.array(z.string()),
    note: z.string().optional(),
  })),
});

// ─────────────────────────────── contact.yml ───────────────────────────────

export const contactSchema = z.object({
  title: z.string(),
  body: z.string(),
  email: z.string().email(),
  email_event: z.string(),
});

// ─────────────────────────────── faq.yml ───────────────────────────────

export const faqSchema = z.object({
  eyebrow: z.string(),
  title: titleWithEmphasis,
  items: z.array(z.object({
    q: z.string(),
    a_html: z.string(),
  })),
});

// ─────────────────────────────── footer.yml ───────────────────────────────

export const footerSchema = z.object({
  logo: z.string(),
  slogan: z.string(),
  links: z.array(link),
  copyright: z.string(),
});

// ─────────────────────────────── legal (privacy.md / terms.md frontmatter) ───────────────────────────────

export const legalSchema = z.object({
  title: z.string(),
  page_tag: z.string(),
  effective_date: z.string(),
  company_label: z.string(),
  toc_title: z.string(),
  toc: z.array(z.object({
    anchor: z.string(),
    label: z.string(),
  })),
});

// ─────────────────────────────── registry ───────────────────────────────

export const schemaByName = {
  meta: metaSchema,
  nav: navSchema,
  hero: heroSchema,
  stats: statsSchema,
  problems: problemsSchema,
  solutions: solutionsSchema,
  how: howSchema,
  model: modelSchema,
  expansion: expansionSchema,
  roadmap: roadmapSchema,
  contact: contactSchema,
  faq: faqSchema,
  footer: footerSchema,
} as const;

export const legalSchemaByName = {
  privacy: legalSchema,
  terms: legalSchema,
} as const;

export type SchemaName = keyof typeof schemaByName;
export type LegalSchemaName = keyof typeof legalSchemaByName;
export type ContentFor<N extends SchemaName> = z.infer<(typeof schemaByName)[N]>;
export type LegalContentFor<N extends LegalSchemaName> = z.infer<(typeof legalSchemaByName)[N]>;
