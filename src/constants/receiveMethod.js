import React from 'react';
import {Cash, BankDeposit, HomeDelivery, Wallet} from '~/components/ui/Icon';

export const CASH_PICKUP = 'CASH_PICKUP';
export const BANK_DEPOSIT = 'BANK_DEPOSIT';
export const HOME_DELIVERY = 'HOME_DELIVERY';
export const WALLET = 'WALLET';

const receiveMethod = [
  {
    id: 1,
    icon: <Cash />,
    payoutMethod: CASH_PICKUP,
    title: 'Cash Pickup',
    caption: 'Pick up money from cash pick up locations',
    component: '',
    value: 'isCashPickupEnabled',
  },
  {
    id: 3,
    payoutMethod: HOME_DELIVERY,
    icon: <HomeDelivery />,
    title: 'Home Delivery',
    caption: "Get the money delivered to beneficiary's home",
    value: 'isHomeDeliveryEnabled',
  },
  {
    id: 2,
    payoutMethod: BANK_DEPOSIT,
    icon: <BankDeposit />,
    title: 'Send to Bank Account',
    caption: "Transfer money to beneficiary's bank account",
    value: 'isBankDepositEnabled',
  },
  {
    id: 4,
    payoutMethod: WALLET,
    icon: <Wallet />,
    title: 'M-Pesa Wallet',
    caption: 'Transfer Money directly to a wallet',
    value: 'isMobileWalletEnabled',
  },
];

export const walletConfig = country =>
  country === 'KEN'
    ? "Deposit money in beneficiary's M-Pesa Wallet"
    : "Deposit money in beneficiary's MTN Wallet";

export const walletTitle = country =>
  country === 'KEN' ? 'M-Pesa Wallet' : 'MTN Wallet';

export default receiveMethod;
