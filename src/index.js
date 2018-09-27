import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Search from './routes/search';
import Settings from './settings';

const addScript = () => {
  if (!document.getElementById('hightlightJS')) {
    const l = document.createElement('link');
    l.id = 'hightlightJS';
    l.setAttribute('rel', 'stylesheet');
    l.setAttribute('href', 'https://highlightjs.org/static/demo/styles/idea.css');
    document.head.appendChild(l);
  }
};
class Audit extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    location: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.connectedApp = props.stripes.connect(Search);
    addScript();
  }

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route path={`${this.props.match.path}`} render={() => <this.connectedApp {...this.props} />} />
        <Route component={() => <div><p>Uh-oh!</p></div>} />
      </Switch>
    );
  }
}

export default Audit;
