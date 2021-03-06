import React from 'react';
import RDropdownMenu from '../microcomponents/RDropdownMenu.js';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import TransferModal from '../microcomponents/TransferModal';
import RevealKeyModal from '../microcomponents/RevealKeyModal';
import CustomSelect from '../microcomponents/CustomSelect';
import {NavLink} from 'react-router-dom';

const networkList = [
  {description: 'xDai', value: 'xDai'},
  {description: 'Mainnet', value: 'Mainnet'},
];

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.notifyRef = React.createRef();
    this.state = {
      keyInfo: {address: '', privateKey: ''},
      unclaimedBonus: '$',
      dataAvailable: '$',
      minimumWithdraw: 99999999,
      gasLimit: 99999999,
      withdrawState: false,
      transferModal: false,
      revealKeyModal: false,
      disableTransfer: false,
      withdrawTo: networkList[0],
      recipient: '',
      recipientEthBalance: '$',
      recipientDataBalance: '$',
      revealFunction: {func: this.copyToClipboard, text: 'copy'},
      claimBtn: 'Claim',
    };
    this.openModal = this.openModal.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.revealPrivateKey = this.revealPrivateKey.bind(this);
    this.pasteWallet = this.pasteWallet.bind(this);
    this.getBalanceInfo = this.getBalanceInfo.bind(this);
    this.loadSettings = this.loadSettings.bind(this);
    this.transfer = this.transfer.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.claimRewards = this.claimRewards.bind(this);
    this.isClaimDisable = this.isClaimDisable.bind(this);
    this.isTransferDisable = this.isTransferDisable.bind(this);
    this.isMessageNeeded = this.isMessageNeeded.bind(this);
  }

  componentDidMount() {
    this.loadSettings().then(this.getBalanceInfo);
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {}

  purgeNumber(num) {
    if (num.indexOf('.') < 0) return num;
    return num.slice(0, num.indexOf('.') + 3);
  }

  async loadSettings() {
    return window.helper.load().then((db) => {
      return window.helper.decryptWallet(db.profile.encryptedWallet, db.configs.salt).then((keyInfo) => {
        this.setState({
          keyInfo: keyInfo,
        });
      });
    });
  }

  transfer(e) {
    let amount = document.querySelector('#swash-amount').value;
    let recipient = document.querySelector('#swash-recipient').value;
    if (!amount.match(/^[0-9]+(\.[0-9]+)?$/)) {
      this.notifyRef.current.handleNotification('Amount value is not valid', 'failure');
      return;
    }

    if (!recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
      this.notifyRef.current.handleNotification('Recipient address is not valid', 'failure');
      return;
    }
    this.openModal('Transfer');
  }

  openModal(name) {
    switch (name) {
      case 'Transfer':
        this.setState({transferModal: !this.state.transferModal});
        break;
      case 'RevealKey':
        if (this.isPrivateKeyRevealed()) {
          this.revealPrivateKey();
          this.forceUpdate();
        } else this.setState({revealKeyModal: !this.state.revealKeyModal, revealFunction: {func: this.revealPrivateKey, text: 'reveal'}});
        break;
      case 'CopyKey':
        this.setState({
          revealKeyModal: !this.state.revealKeyModal,
          revealFunction: {
            func: (e) => {
              let pKey = document.getElementById('swash-privateKey');
              let pKeyType = pKey.type;
              pKey.type = 'text';
              this.copyToClipboard(e, document.getElementById('swash-privateKey'));
              pKey.type = pKeyType;
            },
            text: 'copy',
          },
        });
        break;
      default:
        break;
    }
  }

  async getBalanceInfo() {
    this.setState({
      unclaimedBonus: '$',
      dataAvailable: '$',
    });
    window.helper.getReferralRewards().then((unclaimedBonus) => {
      if (unclaimedBonus.toString() !== this.state.unclaimedBonus) {
        this.setState({
          unclaimedBonus: this.purgeNumber(unclaimedBonus.toString()),
        });
      }
    });
    window.helper.getAvailableBalance().then((dataAvailable) => {
      dataAvailable = dataAvailable.error || dataAvailable === '' || typeof dataAvailable === 'undefined' ? this.state.dataAvailable : dataAvailable;
      if (dataAvailable !== this.state.dataAvailable)
        this.setState({
          dataAvailable: this.purgeNumber(dataAvailable),
        });
    });
  }

  onAmountChange(e) {
    let val = e.target.value;
    if (val > this.state.dataAvailable || this.state.dataAvailable === '0.0') {
      this.setState({disableTransfer: true});
      return;
    }
    this.setState({disableTransfer: false});
  }

  copyToClipboard(e, element) {
    element.select();
    document.execCommand('copy');
    element.blur();
    this.notifyRef.current.handleNotification('Copied successfully', 'success');
  }

  revealPrivateKey(e) {
    let x = document.getElementById('swash-privateKey');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  isPrivateKeyRevealed() {
    let x = document.getElementById('swash-privateKey');
    if (!x) return false;
    return x.type !== 'password';
  }

  isMessageNeeded() {
    return this.state.dataAvailable !== '$' && Number(this.state.dataAvailable) > 0;
  }

  isTransferDisable() {
    if (this.state.dataAvailable === '$' || Number(this.state.dataAvailable) <= 0) return true;
    if (!this.state.withdrawTo) return true;
    if (this.state.withdrawTo.value === 'Mainnet') {
      if (this.state.recipientEthBalance === '$' || Number(this.state.recipientEthBalance) <= 0) return true;
      if (Number(this.state.recipientEthBalance) < this.state.gasLimit && Number(this.state.dataAvailable) < this.state.minimumWithdraw) return true;
    }
    return false;
  }

  pasteWallet(e) {
    e.preventDefault();
    window.helper.getWithdrawBalance().then((response) => {
      if (response.minimum) {
        this.setState({
          minimumWithdraw: response.minimum,
        });
      }
      if (response.gas) {
        this.setState({
          gasLimit: response.gas.toFixed(3),
        });
      }
    });
    navigator.clipboard.readText().then(async (address) => {
      if (address.match(/^0x[a-fA-F0-9]{40}$/g)) {
        document.querySelector('#swash-recipient').value = address;
        let DataBalance = await window.helper.getDataBalance(address);
        let EthBalance = await window.helper.getEthBalance(address);
        this.setState({recipient: address, recipientDataBalance: DataBalance, recipientEthBalance: EthBalance});
      }
    });
  }

  isClaimDisable() {
    return this.state.unclaimedBonus === '$' || Number(this.state.unclaimedBonus) <= 0 || this.state.claimBtn === 'Claiming';
  }

  claimRewards() {
    this.setState({claimBtn: 'Claiming'});
    window.helper.claimRewards().then(
      (result) => {
        if (result.tx) {
          this.getBalanceInfo().then();
          this.notifyRef.current.handleNotification('Rewards are claimed successfully', 'success');
        } else {
          this.notifyRef.current.handleNotification('Failed to claim rewards', 'error');
        }
        this.setState({claimBtn: 'Claim'});
      },
      () => {
        this.setState({claimBtn: 'Claim'});
      }
    );
  }

  render() {
    return (
      <div id="settings-page" className="swash-col">
        <React.Fragment>
          <div className="swash-col">
            <div className="swash-setting-part">
              <div className="swash-balance-block">
                <div className="swash-row">
                  <div className="swash-balance-text">
                    <div className="swash-balance-text-column left">
                      <div className="swash-balance-text-bold">{this.state.dataAvailable} </div>
                      <div>DATA earnings</div>
                    </div>
                    <div className="swash-balance-text-column right">
                      <div className="swash-form-input claim-reward">
                        <div className="amount">{this.state.unclaimedBonus}</div>
                        <div className="description desktop">DATA referral bonus</div>
                        <div className="description mobile">DATA bonus</div>
                      </div>
                      <button className="swash-link-button" onClick={this.claimRewards} disabled={this.isClaimDisable()}>
                        {this.state.claimBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swash-setting-part">
              <div className="swash-form-caption">Wallet address</div>
              <div style={{position: 'relative'}}>
                <input type="text" className="swash-form-input" id="swash-wallet" value={this.state.keyInfo.address} />
                <button
                  className="swash-form-input-button"
                  onBlur={(e) => {
                    e.target.innerText = 'Copy';
                  }}
                  onClick={(e) => {
                    this.copyToClipboard(e, document.getElementById('swash-wallet'));
                    e.target.focus();
                    e.target.innerText = 'Copied';
                  }}>
                  Copy
                </button>
              </div>
              <div className="swash-form-caption">Private key</div>
              <div style={{position: 'relative'}}>
                <input type="password" className="swash-form-input" id="swash-privateKey" value={this.state.keyInfo.privateKey} />
                <RDropdownMenu
                  className="swash-button swash-form-input-button swash-reveal-button"
                  items={[
                    {text: this.isPrivateKeyRevealed() ? 'Hide' : 'Reveal', callback: () => this.openModal('RevealKey')},
                    {
                      text: 'Copy',
                      callback: () => this.openModal('CopyKey'),
                    },
                  ]}
                />
              </div>
            </div>
            <div className="swash-setting-part">
              <div className="swash-head">Withdraw your earnings</div>
              <div className="swash-p">
                You can withdraw your earnings using xDai chain or Ethereum mainnet.
                <br />
                <br />
                It’s important to make sure you have set up your wallet properly (it only takes a few minutes!). Check the{' '}
                <NavLink to="/Help">Help section</NavLink> for step-by-step instructions.
                <br />
                <br />
                xDai is the recommended method as it’s faster and Swash will cover the cost for you! 🎉
                <br />
                <br />
                You can also put your DATA to work by trading or staking liquidity on the{' '}
                <a href="https://info.honeyswap.org/pair/0x0110f008b8815cf00514d54ea11bfa8bb555c69b">DATA/ xDAI pool</a> on{' '}
                <a href="https://app.honeyswap.org/#/swap">Honeyswap</a> 🐝
                <br />
                <br />
                Alternatively, if you use Ethereum, you will be presented with the amount needed in your wallet (in ETH) to cover the transaction fee.
                Exchange wallets are not currently supported.
                <br />
                <br />
                New earnings are available after 48 hours as an anti-fraud measure
              </div>
              <div className="swash-transfer-row">
                <div className="swash-transfer-column swash-amount-column">
                  <div className="swash-form-caption">Amount</div>
                  <div>
                    <input
                      type="text"
                      id="swash-amount"
                      value={this.state.dataAvailable}
                      disabled="true"
                      className="swash-form-input swash-filter-input"
                    />
                  </div>
                </div>

                <div className="swash-transfer-column swash-amount-column">
                  <div className="swash-form-caption">Withdraw to</div>
                  <div>
                    <CustomSelect
                      items={networkList}
                      className={'swash-select-network'}
                      onChange={(item) => {
                        this.setState({withdrawTo: item});
                      }}
                    />
                  </div>
                </div>

                <div className="swash-transfer-column swash-recipient-column">
                  <div className="swash-form-caption">Recipient Wallet address</div>
                  <div>
                    <input
                      type="text"
                      id="swash-recipient"
                      placeholder={this.state.keyInfo.address.substr(0, 7) + '...'}
                      onContextMenu={this.pasteWallet}
                      className="swash-form-input  swash-filter-input"
                    />
                  </div>
                </div>

                <div className="swash-transfer-column swash-transfer-button-column" style={{marginRight: '0px'}}>
                  <button
                    id="swash-transfer-button"
                    className="swash-transfer-link-button"
                    disabled={this.isTransferDisable()}
                    onClick={this.transfer}>
                    Withdraw
                  </button>
                </div>
              </div>
              {this.isMessageNeeded() ? (
                <div className="swash-transfer-row">
                  <div className="swash-transfer-column">
                    <ul>
                      {this.state.withdrawTo.value === 'xDai' ? (
                        <li className={'swash-text-red'}>
                          Make sure you have access to the recipient wallet. Exchange wallets are not compatible with xDai.
                        </li>
                      ) : (
                        ''
                      )}
                      {Number(this.state.dataAvailable) > this.state.minimumWithdraw ? (
                        <li className={'swash-text-green'}>It’s on us. Swash will cover these transaction fees for you! 🎉</li>
                      ) : Number(this.state.recipientEthBalance) > this.state.gasLimit ? (
                        <li className={'swash-text-orange'}>Transaction fee is {this.state.gasLimit} ETH</li>
                      ) : this.state.withdrawTo.value === 'Mainnet' ? (
                        <li className={'swash-text-orange'}>Unable to withdraw - not enough ETH for the gas fee</li>
                      ) : (
                        ''
                      )}
                      {this.state.withdrawTo.value === 'Mainnet' && this.state.recipient ? (
                        <li>
                          Balance: {this.purgeNumber(this.state.recipientEthBalance)} ETH, {this.purgeNumber(this.state.recipientDataBalance)} DATA
                        </li>
                      ) : (
                        ''
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>

          {this.state.transferModal ? (
            <div>
              <div
                onClick={(e) => {
                  if (e.target === e.currentTarget) this.openModal('Transfer');
                }}
                className="swash-modal">
                <TransferModal
                  amount={document.querySelector('#swash-amount').value}
                  recipient={document.querySelector('#swash-recipient').value}
                  opening={() => this.openModal('Transfer')}
                  onSuccess={this.getBalanceInfo}
                  useSponsor={Number(this.state.dataAvailable) > this.state.minimumWithdraw}
                  sendToMainnet={this.state.withdrawTo.value === 'Mainnet'}
                />
              </div>
            </div>
          ) : (
            ''
          )}
          {this.state.revealKeyModal ? (
            <div>
              <div
                onClick={(e) => {
                  if (e.target === e.currentTarget) this.openModal('CopyKey');
                }}
                className="swash-modal">
                <RevealKeyModal
                  func={(e) => {
                    this.state.revealFunction.func(e, document.getElementById('swash-privateKey'));
                  }}
                  text={this.state.revealFunction.text}
                  opening={() => this.openModal('CopyKey')}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </React.Fragment>
        <CustomSnackbar ref={this.notifyRef} />
      </div>
    );
  }
}

export default SettingsPage;
