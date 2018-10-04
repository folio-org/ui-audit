import React from 'react';
import PropTypes from 'prop-types';
import { Pane, Icon } from '@folio/stripes/components';
import Highlight from 'react-highlight.js';

class ViewAuditData extends React.Component {
  static manifest = Object.freeze({
    query: {},
    selectedInstance: {
      type: 'okapi',
      path: 'audit-data/:{id}',
      clear: false,
    },
  });

  getInstance() {
    const { resources, match: { params: { id } } } = this.props;
    const selectedInstance = (resources.selectedInstance || {}).records || [];
    if (!selectedInstance || selectedInstance.length === 0 || !id) return null;
    return selectedInstance.find(u => u.id === id);
  }

  render() {
    const records = this.getInstance();
    if (!records) {
      return (
        <Pane
          id="pane-recorddetails"
          defaultWidth={this.props.paneWidth}
          paneTitle="Audit Data"
          lastMenu={<span />}
          dismissible
          onClose={this.props.onClose}
        >
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }
    return (
      <Pane
        id="pane-recorddetails"
        defaultWidth={this.props.paneWidth}
        paneTitle="Audit Data"
        lastMenu={<span />}
        dismissible
        onClose={this.props.onClose}
      >
        <div>
          <Highlight language="json">
            {JSON.stringify(records, null, 2)}
          </Highlight>
        </div>
      </Pane>
    );
  }
}

ViewAuditData.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    logger: PropTypes.object.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  }).isRequired,
  resources: PropTypes.shape({
    selectedInstance: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func,
  paneWidth: PropTypes.string.isRequired
};

export default ViewAuditData;
