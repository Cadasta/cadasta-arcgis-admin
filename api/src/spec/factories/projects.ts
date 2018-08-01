import { Factory } from 'rosie';
import Chance from 'chance';

const chance = new Chance();

export const ProjectFactory = Factory.define<Project>('Project')
  .attr('name', () => `${chance.city()} ${chance.pickone(['farm', 'slum', 'favella'])} ${chance.pickone(['census', 'survey', 'settlements'])}`)
  .attr('slug', ['name'], (name) => name.replace(/\s/g, '-').toLowerCase())
  .attr('created_by', () => chance.twitter().replace('@', ''))
  .attr('created_date', () => chance.date().toISOString())
  .attr('modified_by', () => chance.twitter().replace('@', ''))
  .attr('modified_date', () => chance.date().toISOString())
;
