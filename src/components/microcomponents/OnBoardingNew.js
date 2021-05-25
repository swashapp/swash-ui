import React from 'react';
import CustomRadioBox from './CustomRadioBox.js';
import PropTypes from 'prop-types';

class OnBoardingNewPage extends React.Component {
  static get propTypes() {
    return {
      nextPage: PropTypes.string,
      ChangeSelectedPage: PropTypes.func,
      ChangeOnBoardingPage: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.state.userType = 'Create';
    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
    this.radioChangeHandler = this.radioChangeHandler.bind(this);
  }

  LoadOnBoardingNew() {
    this.props.ChangeSelectedPage('New', this.state.userType);
    this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  radioChangeHandler(selectedType) {
    if (selectedType != null && selectedType !== this.state.userType) {
      this.setState({
        userType: selectedType,
      });
    }
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-onboarding-box">
            <div className="swash-onboarding-box-header">
              <p>Are you new to Swash?</p>
            </div>
            <div className="swash-onboarding-box-body">
              <div>
                <div
                  className="swash-onboarding-box-body-radio"
                  onClick={() => {
                    this.setState({userType: 'Create'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <CustomRadioBox id="Create" handleClick={this.radioChangeHandler} isChecked={this.state.userType === 'Create'} />
                  <span>Yes, I’m new here</span>
                  <br />
                  <div className="swash-onboarding-text-gray">Create a new wallet</div>
                </div>
                <div
                  className="swash-onboarding-box-body-radio"
                  onClick={() => {
                    this.setState({userType: 'Import'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <CustomRadioBox id="Import" handleClick={this.radioChangeHandler} isChecked={this.state.userType === 'Import'} />
                  <span>No, I already have a wallet</span>
                  <br />
                  <div className="swash-onboarding-text-gray">Import your existing wallet settings</div>
                </div>
              </div>
            </div>
            <div className="swash-onboarding-box-footer">
              <div className="swash-onboarding-box-footer-left" />
              <div className="swash-onboarding-box-footer-right">
                <div className="swash-onboarding-proceed-button" onClick={this.LoadOnBoardingNew}>
                  Next
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingNewPage;
