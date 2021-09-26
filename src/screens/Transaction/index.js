import React from 'react';
import GenericView from '~/components/ui/GenericView';
import {BoldText} from '~/components/ui/Text';
import Header from '~/components/ui/Header';
import {TransactionList} from '~/screens/Shared';

export default function Transaction() {
  return (
    <GenericView padding isScrollable header={<Header title="Transactions" />}>
      <BoldText text="All Transaction" />
      <TransactionList />
    </GenericView>
  );
}
