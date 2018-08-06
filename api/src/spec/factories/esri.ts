import { ArcGISRequestError } from '@esri/arcgis-rest-request';
import Chance from 'chance';
import { Factory } from 'rosie';

import { responseBodyFactory } from './';

const chance = new Chance();

export const ArcGISGroupFactory = Factory.define<ArcGISGroup>('Group')
  .attr('title', () => chance.sentence({ words: 5 }))
  .attr('id', () => chance.string())
  .attr('isInvitationOnly', () => chance.bool())
  .attr('owner', () => chance.twitter().replace('@', ''))
  .attr('tags', () => ['test'])
  .attr('isViewOnly', () => chance.bool())
  .attr('isFav', () => chance.bool())
  .attr('created', () => chance.timestamp())
  .attr('modified', () => chance.timestamp())
  .attr('access', () => chance.pickone(['private', 'org', 'public']) as 'private' | 'org' | 'public')
  .attr('protected', () => chance.bool())
  .attr('autoJoin', () => chance.bool())
;

export const ArcGISCreateGroupRequestFactory = Factory.define<ArcGISCreateGroupRequest>('ArcGISCreateGroupRequest')
  .attr('title', () => chance.sentence({ words: 5 }))
  .attr('isInvitationOnly', () => chance.bool())
  .attr('tags', () => ['test'])
  .attr('isViewOnly', () => chance.bool())
  .attr('access', () => chance.pickone(['private', 'org', 'public']) as 'private' | 'org' | 'public')
  .attr('autoJoin', () => chance.bool())
;

export const ArcGISRequestErrorFactory = Factory.define<ArcGISRequestError>('ArcGISRequestError')
  .attr('name', 'ArcGISRequestError')
  .attr('message', 'COM_0044: Unable to create group.')
  .attr('originalMessage', 'Unable to create group.')
  .attr('code', 'COM_0044')
  .attr('response', {
    'error': {
      'code': 400,
      'details': [
        '\'title\' parameter must be specified.',
        '\'access\' parameter must be specified.'
      ],
      'message': 'Unable to create group.',
      'messageCode': 'COM_0044',
    }
  })
  .attr('url', 'https://maps.cadasta.org/arcgis/sharing/rest/community/createGroup')
  // .attr('options', () => ({
  //   'httpMethod': 'POST',
  //   'authentication': {
  //     'portal': 'https://maps.cadasta.org/arcgis/sharing/rest'
  //   },
  //   'group': {
  //     'tags': []
  //   },
  //   'params': {
  //     'tags': ''
  //   })
  // })
;

export const userResponseFactory = (userDetails = {}) => ({
  disabled: false,
  role: 'org_admin',
  username: 'factoryUser',
  ...userDetails
});
