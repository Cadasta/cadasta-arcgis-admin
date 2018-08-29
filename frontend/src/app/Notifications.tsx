import * as React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import { actions as notifActions, Notifs } from 'redux-notifications';

import './Notifications.css';

const NotifsAlertAdapter = ({kind, close, showClose = true, id, message}: any) =>
  <Alert
    color={kind}
    toggle={showClose ? close.bind(null, id) : false}
  >
    {message}
  </Alert>
;

export default connect(
  () => ({
    CustomComponent: NotifsAlertAdapter // Hack: use mapStateToProps to bind prop argument to Notifs component
  }),
  dispatch => ({
    close: (id: any) => dispatch(notifActions.notifDismiss(id))
  })
)(Notifs);
