import React from 'react';
import verified from '../../statics/images/verified.svg';
import error from '../../statics/images/error-icon.svg';
import arrow from '../../statics/images/arrow.svg';
import PropTypes from 'prop-types';
import CustomCheckBox from './CustomCheckBox';

class TransferModal extends React.Component {
  static get propTypes() {
    return {
      tx: PropTypes.string,
      opening: PropTypes.func,
      amount: PropTypes.string,
      recipient: PropTypes.string,
      useSponsor: PropTypes.bool,
      sendToMainnet: PropTypes.bool,
      onSuccess: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      status: 'init',
      opening: this.props.opening,
      transactionId: this.props.tx,
      amount: this.props.amount,
      recipient: this.props.recipient,
      sendToMainnet: this.props.sendToMainnet,
      useSponsor: this.props.useSponsor,
      failedReason: '',
    };
    this.withdraw = this.withdraw.bind(this);
  }

  purgeNumber(num) {
    let temp = num.toString();
    if (temp.indexOf('.') < 0) return temp;
    return temp.slice(0, temp.indexOf('.') + 5);
  }

  withdraw() {
    this.setState({status: 'waiting'});
    window.helper.withdrawToTarget(this.state.recipient, this.state.amount, this.state.useSponsor, this.state.sendToMainnet).then((result) => {
      console.log(result);
      if (result.tx) {
        this.setState({status: 'confirmed'});
        this.setState({transactionId: result.tx});
        this.props.onSuccess().then();
      } else {
        this.setState({status: 'failed', failedReason: result.reason});
      }
    });
  }

  purgeAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(37, 42)}`;
  }

  renderModal() {
    switch (this.state.status) {
      case 'confirmed':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Transfer completed</p>
            </div>
            <div className="swash-transaction-modal-body swash-transaction-modal-body-large">
              <img src={verified} alt={'Verified'} />
              <p>
                Verify your transaction on{' '}
                {this.state.sendToMainnet ? (
                  <>
                    <a target="_blank" rel="noopener noreferrer" href={`https://etherscan.io/tx/${this.state.transactionId}`}>
                      Etherscan
                    </a>
                  </>
                ) : (
                  <>
                    <a target="_blank" rel="noopener noreferrer" href={`https://blockscout.com/xdai/mainnet/tx/${this.state.transactionId}`}>
                      Blockscout
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Transfer failed</p>
            </div>
            <div className="swash-transaction-modal-body swash-transaction-modal-body-large">
              <img src={error} alt={'Error'} />
              <p>Reason: {this.state.failedReason}</p>
            </div>
          </div>
        );
      case 'init':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Confirm DATA transfer</p>
            </div>
            <div className="swash-transaction-modal-body">
              <div className="swash-transaction-modal-body-left">
                <div className="swash-transaction-modal-body-text1">Send</div>
                <div className="swash-transaction-modal-body-text2">
                  <span className="swash-transaction-modal-body-text3">{this.state.amount}</span> DATA
                </div>
              </div>
              <div className="swash-transaction-modal-body-middle">
                <img src={arrow} alt={'Arrow'} />
              </div>
              <div className="swash-transaction-modal-body-right">
                <div className="swash-transaction-modal-body-text1">To address</div>
                <div className="swash-transaction-modal-body-text3">{this.purgeAddress(this.state.recipient)}</div>
              </div>
            </div>
            <div className="swash-transaction-modal-footer">
              <div className="swash-transaction-modal-footer-right">
                <div className="swash-transaction-modal-button" onClick={this.withdraw}>
                  Confirm and send
                </div>

                <div className="swash-transaction-modal-button-cancel" onClick={this.state.opening}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        );
      case 'waiting':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Confirm DATA transfer</p>
            </div>
            <div className="swash-transaction-modal-body">
              <div className="swash-transaction-modal-body-left">
                <div className="swash-transaction-modal-body-text1">Send</div>
                <div className="swash-transaction-modal-body-text2">
                  <span className="swash-transaction-modal-body-text3">{this.state.amount}</span> DATA
                </div>
              </div>
              <div className="swash-transaction-modal-body-middle">
                <img src={arrow} alt={'Arrow'} />
              </div>
              <div className="swash-transaction-modal-body-right">
                <div className="swash-transaction-modal-body-text1">To address</div>
                <div className="swash-transaction-modal-body-text3">{this.purgeAddress(this.state.recipient)}</div>
              </div>
            </div>
            <div className="swash-transaction-modal-footer">
              <div className="swash-transaction-modal-footer-right">
                <div className="swash-transaction-modal-button swash-transaction-modal-button-waiting">Sending...</div>
                <div className="swash-transaction-modal-button-cancel" onClick={this.state.opening}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return '';
    }
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-transaction-modal">{this.renderModal()}</div>
        </React.Fragment>
      </div>
    );
  }
}

export default TransferModal;
