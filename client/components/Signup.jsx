import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import { userSignup, clearSignupState } from '../actions/user';
import EmailForm from './EmailForm.jsx';

/**
 * @class Signup
 * @classdesc returns Signin component
 */
class Signup extends Component {
  /**
   * @param {object} props
   * @return {undefined}
   */
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  /**
   * @param {object} nextProps
   * @return {undefined}
   */
  componentWillReceiveProps(nextProps) {
    const { successfullySignedup } = nextProps;
    if (successfullySignedup && successfullySignedup.length > 0) {
      browserHistory.push('/redirect');
    }
    if (nextProps.signup.errors.message) {
      toastr.error(nextProps.signup.errors.message);
    }
  }
  /**
   * @param {object} event
   * @return {undefined}
   */
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  /**
   * @param {object} event
   * @return {undefined}
   */
  onSubmit(event) {
    event.preventDefault();
    this.props.clearSignupState();
    this.props.userSignup(this.state);
  }
  /**
   * @return {XML} JSX
   */
  render() {
    const { isLoading } = this.props.signup;
    const span = <span />;
    const mdlButtonStyle = `
    mdl-button
    mdl-js-button
    mdl-button--raised
    mdl-button--colored
    `;
    return (
      <div className="mdl-grid">
        <div className="contents">
          <div className="card-enlarge mdl-card mdl-shadow--3dp">
            <form onSubmit={this.onSubmit}>
              <EmailForm
                onChange={this.onChange}
              />
              <button
                disabled={isLoading}
                className={mdlButtonStyle}
                id="button">
                Sign up
              </button>
            </form>
            <div className="mdl-card__supporting-text ask">
              Already have an account? Sign in below
            </div>
            <Link to="/signin">
              <button
              className="mdl-button mdl-js-button mdl-button--raised"
              id="button">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
Signup.propTypes = {
  userSignup: propTypes.func.isRequired,
};
/**
 * @param {object} state
 * @return {object} props
 */
const mapStateToProps = state => ({
  signup: state.userSignup,
  successfullySignedup: state.userSignup.successfullySignedup.message
});
export default connect(
  mapStateToProps,
  { userSignup, clearSignupState }
)(Signup);
