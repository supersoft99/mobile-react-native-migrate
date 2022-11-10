import React from 'react';
import { View, Image, TouchableOpacity, Alert, H1 } from 'react-native';
import { Item, Text, Form, Label, Content, Container } from 'native-base';
import { bankAccountsStyle } from './bankAccounts-style';
import { I18n } from 'react-i18next';
import { Loading } from '../../shared/components';
import { ModalHeader } from '../../shared/components/ModalHeader';
import AddBankAccount from './AddBankAccount';
import { fetchBankAccounts, deleteBankAccount } from './bankAccounts-actions';
import { View as FluxView } from '@cobuildlab/react-flux-state';
import {
  BANK_ACCOUNTS_ERROR_EVENT,
  BANK_ACCOUNTS_EVENT,
  DELETE_BANK_ACCOUNT_EVENT,
  bankAccountStore,
  BANK_ACCOUNTS_NEW_EVENT,
} from './BankAccountsStore';
import type { BankAccount } from './bank-accounts-types';
import CustomToast from '../../shared/components/CustomToast';
import { i18next } from '../../i18n';
import { LOG } from '../../shared';
import { getUser } from '../Account/actions';
import accountStore from '../Account/AccountStore';

class BankAccounts extends FluxView {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      bankAccounts: [],
      user: {},
    };
  }

  componentDidMount(): void {
    this.subscribe(
      bankAccountStore,
      BANK_ACCOUNTS_ERROR_EVENT,
      (err: Error) => {
        this.setState({ isLoading: false }, () => {
          CustomToast(String(err), 'danger');
        });
      },
    );
    this.subscribe(
      bankAccountStore,
      BANK_ACCOUNTS_EVENT,
      (bankAccounts: Array<BankAccount>) => {
        this.setState({ isLoading: false, bankAccounts });
      },
    );
    this.subscribe(bankAccountStore, DELETE_BANK_ACCOUNT_EVENT, () => {
      this.setState({ isLoading: false });
      fetchBankAccounts();
    });
    this.subscribe(bankAccountStore, BANK_ACCOUNTS_NEW_EVENT, () => {
      fetchBankAccounts();
    });
    this.getUserSubscription = accountStore.subscribe('getUser', (user) => {
      this.setState({ user });
    });
    getUser();
    fetchBankAccounts();
  }

  goToAddBankAccounts = () => {
    const { user } = this.state;
    if (!user.birth_date) {
      return CustomToast(i18next.t('BANK_ACCOUNTS.needBirthDate'), 'danger');
    }
    // if (!user.last_4dig_ssn) {
    //   return CustomToast(i18next.t('BANK_ACCOUNTS.needSsn4digits'), 'danger');
    // }
    if (user.birth_date)
      this.props.navigation.navigate(AddBankAccount.routeName);
  };

  deleteBankAccountAlert = (bankAccount) => {
    Alert.alert(
      i18next.t('BANK_ACCOUNTS.wantToDeleteBankAccount'),
      ` ${bankAccount.name}?`,
      [
        {
          text: i18next.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel delete bank account');
          },
        },
        {
          text: i18next.t('BANK_ACCOUNTS.deleteBankAcount'),
          onPress: () => {
            this.setState({ isLoading: true }, () => {
              deleteBankAccount(bankAccount);
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  render() {
    const { isLoading, bankAccounts } = this.state;
    return (
      <I18n>
        {(t) => (
          <Container>
            <ModalHeader title={t('BANK_ACCOUNTS.bankAccounts')} />
            {isLoading ? <Loading /> : null}
            <Content>
              <View style={bankAccountsStyle.container}>
                <View>
                  {bankAccounts.length > 0 && (
                    <View
                      style={{
                        paddingTop: 5,
                      }}>
                      <Text
                        style={{
                          marginBottom: 15,
                          fontWeight: '700',
                          fontSize: 24,
                          lineHeight: 45,
                        }}>
                        {'Your bank account is ready to receive payment.'}
                      </Text>
                    </View>
                  )}
                  <Form>
                    {bankAccounts.length > 0 ? (
                      bankAccounts.map(
                        (bankAccount: BankAccount, i: number) => {
                          return (
                            <View key={i} style={bankAccountsStyle.formStyle}>
                              <Item
                                style={bankAccountsStyle.viewInput}
                                inlineLabel
                                rounded>
                                <Label>
                                  <Text style={{ fontWeight: '500' }}>
                                    {bankAccount.institution_name +
                                      '\n' +
                                      bankAccount.name +
                                      ' - ' +
                                      bankAccount.account}
                                  </Text>
                                </Label>
                              </Item>

                              <TouchableOpacity
                                onPress={() =>
                                  this.deleteBankAccountAlert(bankAccount)
                                }>
                                <Image
                                  style={bankAccountsStyle.garbageIcon}
                                  source={require('../../assets/image/delete.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          );
                        },
                      )
                    ) : (
                      <Text style={bankAccountsStyle.noDocsText}>
                        {t('BANK_ACCOUNTS.noBankAccounts')}
                      </Text>
                    )}
                  </Form>
                </View>
              </View>
            </Content>
            <View style={bankAccountsStyle.buttonContainer}>
              {!isLoading && bankAccounts.length === 0 && (
                <TouchableOpacity onPress={this.goToAddBankAccounts}>
                  <View full style={bankAccountsStyle.viewButtomLogin}>
                    <Text style={bankAccountsStyle.textButtom}>
                      {t('BANK_ACCOUNTS.addBankAccount')}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </Container>
        )}
      </I18n>
    );
  }
}

BankAccounts.routeName = 'BankAccounts';
export default BankAccounts;
