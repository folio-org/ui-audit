import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import ViewAuditData from '../components/ViewAuditData';
import packageInfo from '../../package';

const filterConfig = [
  {
    label: 'Method',
    name: 'method',
    cql: 'method',
    values: [
      { name: 'POST', cql: 'POST' },
      { name: 'PUT', cql: 'PUT' },
      { name: 'DELETE', cql: 'DELETE' },
      { name: 'PATCH', cql: 'PATCH' },
    ],
    restrictWhenAllSelected: true,
  },
  {
    label: 'Module Result Status Codes',
    name: 'Status Code',
    cql: 'module_result',
    values: [
      { name: '201', cql: '201' },
      { name: '204', cql: '204' },
      { name: '403', cql: '403' },
      { name: '400', cql: '400' },
      { name: '422', cql: '422' },
      { name: '500', cql: '500' },
    ],
    restrictWhenAllSelected: true,
  }
];

const searchableIndexes = [
  { label: 'Target Id', value: 'target_id', makeQuery: term => `(target_id="${term}*")` },
  { label: 'Target Type', value: 'target_type', makeQuery: term => `(target_type="${term}*")` },
  { label: 'Request Id', value: 'request_id', makeQuery: term => `(request_id="${term}*")` },
  { label: 'User', value: 'user', makeQuery: term => `(user="${term}*")` },
  { label: 'Timestamp', value: 'timestamp', makeQuery: term => `(timestamp="${term}*")` }
];

class Search extends React.Component {
  static defaultProps = {
    browseOnly: false,
    showSingleResult: true,
  }

  static propTypes = {
    resources: PropTypes.shape({
      records: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        other: PropTypes.shape({
          totalRecords: PropTypes.number,
          total_records: PropTypes.number,
        })
      }),
      query: PropTypes.shape({
        qindex: PropTypes.string,
        query: PropTypes.string,
      }),
    }),
    locations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }),
    }),
    onSelectRow: PropTypes.func,
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    browseOnly: PropTypes.bool,
  }

  static manifest = Object.freeze({
    resultCount: { initialValue: 30 },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'timestamp',
      },
    },
    records: {
      type: 'okapi',
      records: 'audit',
      path: 'audit-data',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            'target_id="%{query.query}*"',
            {
              'id': 'target_id',
              'Timestamp': 'timestamp',
              'Target Id': 'target_id',
              'Target Type': 'target_type',
              'User': 'user',
            },
            filterConfig,
            false,
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    const logger = this.props.stripes.logger;
    logger.log('action', `changed query-index to '${qindex}'`);
    this.props.mutator.query.update({ qindex });
  }

  render() {
    const { onSelectRow, browseOnly } = this.props;
    const resultsFormatter = {
      'User': x => (x.user || []),
      'Target Id': x => (x.target_id || []),
      'Target Type': x => (x.target_type || []),
      'Timestamp': x => (x.timestamp || [])
    };

    return (<SearchAndSort
      packageInfo={packageInfo}
      objectName="audit"
      selectedIndex={_.get(this.props.resources.query, 'qindex')}
      searchableIndexes={searchableIndexes}
      searchableIndexesPlaceholder={null}
      onChangeIndex={this.onChangeIndex}
      maxSortKeys={1}
      filterConfig={filterConfig}
      initialResultCount={30}
      resultCountIncrement={30}
      viewRecordComponent={ViewAuditData}
      visibleColumns={['Timestamp', 'Target Id', 'Target Type', 'User']}
      columnWidths={{ 'timestamp': '30%', 'target id': '30%', 'target type': '30%', 'user': '30%' }}
      resultsFormatter={resultsFormatter}
      viewRecordPerms="audit.item.get"
      disableRecordCreation
      parentResources={this.props.resources}
      parentMutator={this.props.mutator}
      path={`${this.props.match.path}/(view)/:id`}
      notLoadedMessage="Enter search query to show results"
      browseOnly={browseOnly}
      onSelectRow={onSelectRow}
    />);
  }
}

export default Search;
