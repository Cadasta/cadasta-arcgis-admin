import { AWSError } from 'aws-sdk';
import { Factory } from 'rosie';

export const AWSErrorFactory = Factory.define<AWSError>('AWSError')
  .attr('message', 'The specified domain does not exist.')
  .attr('code', 'NoSuchDomain')
  .attr('statusCode', 400)
  .attr('retryable', false)
  .attr('time', new Date('2018-01-01'))
  .attr('hostname', '')
  .attr('region', 'us-west-2')
  .attr('retryDelay', 1)
  .attr('requestId', '')
  .attr('extendedRequestId', '')
  .attr('cfId', '')
;
