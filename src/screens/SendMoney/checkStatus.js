// 1. UNVERIFIED ==> Load the KYC widget and let them fill KYC form.
// 2. REVIEW_PENDING ==> Let them continue to create transaction.
// 3. RETRY_REQUESTED ==> Load the KYC widget.
// 4. DOCUMENT_REQUESTED ==> Load the KYC widget.
// 5. SUSPENDED ==> Not allowed to create transaction, add beneficiary or bank/cards. Only let them view previous txns or other pre-informations.
// 6. VERIFIED ==> Allowed to continue and create transaction.

const STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  REVIEW_PENDING: 'REVIEW_PENDING',
  RETRY_REQUESTED: 'RETRY_REQUESTED',
  DOCUMENT_REQUESTED: 'DOCUMENT_REQUESTED',
  SUSPENDED: 'SUSPENDED',
  VERIFIED: 'VERIFIED',
  RETRY: 'RETRY',
};
const checkStatus = kycStatus => {
  let canContinue = false;
  switch (kycStatus) {
    case STATUS.UNVERIFIED:
      canContinue = false;
      break;
    case STATUS.REVIEW_PENDING:
      canContinue = true;
      break;
    case STATUS.RETRY_REQUESTED:
      canContinue = false;
      break;
    case STATUS.DOCUMENT_REQUESTED:
      canContinue = false;
      break;
    case STATUS.SUSPENDED:
      canContinue = false;
      break;
    case STATUS.RETRY:
      canContinue = false;
      break;
    case STATUS.VERIFIED:
      canContinue = true;
      break;
    default:
      canContinue = false;
      break;
  }
  return canContinue;
};

export default checkStatus;
