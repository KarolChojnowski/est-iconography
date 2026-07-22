import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templateRoot = path.join(root, '.github/ISSUE_TEMPLATE');
const errors = [];

const expectedForms = [
  {
    file: 'new-asset.yml',
    title: '[New asset]: ',
    requiredIds: [
      'product_context',
      'owner',
      'need',
      'concept',
      'family',
      'use_context',
      'alternatives',
      'evidence',
      'display_size',
      'accessibility_context',
      'timing',
      'confirmation'
    ]
  },
  {
    file: 'change-asset.yml',
    title: '[Asset change]: ',
    requiredIds: [
      'canonical_id',
      'owner',
      'change_type',
      'problem',
      'proposed_outcome',
      'usage_evidence',
      'compatibility',
      'consumer_impact',
      'intended_decision',
      'confirmation'
    ]
  },
  {
    file: 'lifecycle-change.yml',
    title: '[Lifecycle]: ',
    requiredIds: [
      'canonical_ids',
      'owner',
      'lifecycle_action',
      'rationale',
      'replacement',
      'consumer_evidence',
      'migration',
      'release_timing',
      'figma_impact',
      'confirmation'
    ]
  }
];

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

async function readYaml(file) {
  const content = await readFile(path.join(templateRoot, file), 'utf8');
  try {
    return { content, value: yaml.load(content) };
  } catch (error) {
    fail(file, `Invalid YAML: ${error.message}`);
    return { content, value: null };
  }
}

const files = (await readdir(templateRoot)).filter((file) => file.endsWith('.yml')).sort();
const expectedFiles = ['config.yml', ...expectedForms.map((form) => form.file)].sort();
if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) {
  fail('ISSUE_TEMPLATE', `Expected ${expectedFiles.join(', ')}; found ${files.join(', ')}`);
}

const config = (await readYaml('config.yml')).value;
if (!config || typeof config !== 'object' || Array.isArray(config)) {
  fail('config.yml', 'The issue-template configuration must be an object.');
} else {
  if (config.blank_issues_enabled !== false) {
    fail('config.yml', 'Blank issues must remain disabled.');
  }
  if (!Array.isArray(config.contact_links) || config.contact_links.length < 2) {
    fail('config.yml', 'At least two contact links are required.');
  } else {
    const linkNames = new Set();
    for (const [index, link] of config.contact_links.entries()) {
      if (!link?.name || !link?.url || !link?.about) {
        fail('config.yml', `Contact link ${index + 1} must include name, url and about.`);
        continue;
      }
      if (!String(link.url).startsWith('https://')) {
        fail('config.yml', `Contact link ${index + 1} must use HTTPS.`);
      }
      if (linkNames.has(link.name)) {
        fail('config.yml', `Duplicate contact-link name "${link.name}".`);
      }
      linkNames.add(link.name);
    }
  }
}

const titlePrefixes = new Set();
const allowedTypes = new Set(['markdown', 'input', 'textarea', 'dropdown', 'checkboxes']);

for (const expected of expectedForms) {
  const { content, value: form } = await readYaml(expected.file);
  if (!form || typeof form !== 'object' || Array.isArray(form)) {
    fail(expected.file, 'The issue form must be an object.');
    continue;
  }

  for (const property of ['name', 'description', 'title']) {
    if (typeof form[property] !== 'string' || form[property].trim() === '') {
      fail(expected.file, `Missing non-empty ${property}.`);
    }
  }

  if (form.title !== expected.title) {
    fail(expected.file, `Expected title prefix "${expected.title}".`);
  }
  if (titlePrefixes.has(form.title)) {
    fail(expected.file, `Duplicate title prefix "${form.title}".`);
  }
  titlePrefixes.add(form.title);

  if ('labels' in form || 'assignees' in form) {
    fail(expected.file, 'Forms must not depend on pre-existing repository labels or assignees.');
  }

  if (!Array.isArray(form.body) || form.body.length === 0) {
    fail(expected.file, 'The body must contain issue-form fields.');
    continue;
  }

  const ids = new Set();
  const fieldsById = new Map();

  for (const [index, field] of form.body.entries()) {
    const location = `body item ${index + 1}`;
    if (!field || typeof field !== 'object' || Array.isArray(field)) {
      fail(expected.file, `${location} must be an object.`);
      continue;
    }
    if (!allowedTypes.has(field.type)) {
      fail(expected.file, `${location} has unsupported type "${field.type}".`);
      continue;
    }

    if (field.type === 'markdown') {
      if (typeof field.attributes?.value !== 'string' || field.attributes.value.trim() === '') {
        fail(expected.file, `${location} markdown must contain a value.`);
      }
      continue;
    }

    if (typeof field.id !== 'string' || !/^[a-z][a-z0-9_]*$/.test(field.id)) {
      fail(expected.file, `${location} requires a lowercase snake-case id.`);
      continue;
    }
    if (ids.has(field.id)) {
      fail(expected.file, `Duplicate field id "${field.id}".`);
    }
    ids.add(field.id);
    fieldsById.set(field.id, field);

    if (typeof field.attributes?.label !== 'string' || field.attributes.label.trim() === '') {
      fail(expected.file, `${field.id} requires a non-empty label.`);
    }

    if (field.type === 'dropdown') {
      if (!Array.isArray(field.attributes?.options) || field.attributes.options.length < 2) {
        fail(expected.file, `${field.id} dropdown requires at least two options.`);
      }
    }

    if (field.type === 'checkboxes') {
      const options = field.attributes?.options;
      if (!Array.isArray(options) || options.length === 0) {
        fail(expected.file, `${field.id} checkboxes require options.`);
      } else {
        for (const [optionIndex, option] of options.entries()) {
          if (!option?.label || option.required !== true) {
            fail(expected.file, `${field.id} option ${optionIndex + 1} must have a label and be required.`);
          }
        }
      }
    }
  }

  for (const id of expected.requiredIds) {
    const field = fieldsById.get(id);
    if (!field) {
      fail(expected.file, `Missing required field id "${id}".`);
      continue;
    }
    if (field.type !== 'checkboxes' && field.validations?.required !== true) {
      fail(expected.file, `${id} must set validations.required to true.`);
    }
  }

  if (/\b(?:TODO|TBD|FIXME)\b/.test(content)) {
    fail(expected.file, 'Issue forms must not contain unfinished placeholders.');
  }
}

if (errors.length > 0) {
  console.error(`\nIssue-form validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${expectedForms.length} governed issue forms and the issue chooser configuration.`);
