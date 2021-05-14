import React from 'react';
import CustomSelect from './CustomSelect';
import PropTypes from 'prop-types';

const genderList = [
  {description: 'Select', value: null},
  {description: 'Non-binary', value: 'Non-binary'},
  {description: 'Male', value: 'Male'},
  {description: 'Female', value: 'Female'},
];

const ageList = [
  {description: 'Select', value: null},
  {description: '< 20', value: '-20'},
  {description: '20-30', value: '20-30'},
  {description: '30-40', value: '30-40'},
  {description: '40-50', value: '40-50'},
  {description: '50+', value: '50+'},
];

const incomeList = [
  {description: 'Select', value: null},
  {description: '< $12K', value: '-12K'},
  {description: '$12K - $25K', value: '12-25K'},
  {description: '$25K - $50K', value: '25-50K'},
  {description: '$50K - $75K', value: '50-75K'},
  {description: '$75K - $150K', value: '75-150K'},
  {description: '$150K+', value: '150K+'},
];

class OnBoardingYourProfile extends React.Component {
  static get propTypes() {
    return {
      nextPage: PropTypes.string,
      previousPage: PropTypes.string,
      ChangeOnBoardingPage: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: 'YourProfileWarning',
      gender: genderList[0],
      age: ageList[0],
      income: incomeList[0],
    };

    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  LoadOnBoardingNew() {
    if (this.state.gender.value !== null && this.state.age.value && this.state.income.value) {
      window.helper.saveProfileInOnBoarding(this.state.gender.value, this.state.age.value, this.state.income.value).then(() => {
        this.props.ChangeOnBoardingPage(this.props.nextPage());
      });
    }
  }

  goToPreviousPage() {
    this.props.ChangeOnBoardingPage(this.props.previousPage());
  }

  isCompleted() {
    return this.state.gender.value !== null && this.state.age.value !== null && this.state.income.value !== null;
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-onboarding-box">
            <div className="swash-onboarding-box-header">
              <p>Your Profile</p>
            </div>
            <div className="swash-onboarding-box-body">
              <div className="swash-profile-box">
                <div className="swash-profile-select">
                  <p className={'swash-onboarding-select-label'}>Gender</p>
                  <CustomSelect
                    items={genderList}
                    className={'swash-onboarding-select-container'}
                    onChange={(item) => {
                      this.setState({gender: item});
                    }}
                  />
                </div>
                <div className="swash-profile-select">
                  <p className={'swash-onboarding-select-label'}>Age</p>
                  <CustomSelect
                    items={ageList}
                    className={'swash-onboarding-select-container'}
                    onChange={(item) => {
                      this.setState({age: item});
                    }}
                  />
                </div>
                <div className="swash-profile-select">
                  <p className={'swash-onboarding-select-label'}>Household Income</p>
                  <CustomSelect
                    items={incomeList}
                    className={'swash-onboarding-select-container'}
                    onChange={(item) => {
                      this.setState({income: item});
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="swash-onboarding-box-footer">
              <div className="swash-onboarding-box-footer-left" />
              <div className="swash-onboarding-box-footer-right">
                <div
                  className={this.isCompleted() ? 'swash-onboarding-proceed-button' : 'swash-onboarding-proceed-disable-button'}
                  onClick={this.LoadOnBoardingNew}>
                  Proceed
                </div>
                <div style={{float: 'right', cursor: 'pointer'}}>
                  <span onClick={this.goToPreviousPage}>Back</span>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingYourProfile;
