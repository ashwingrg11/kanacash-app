import bigdecimal from 'bigdecimal';

const calculateFee = ({feeRange, senderAmount}) => {
  senderAmount = senderAmount ?? 0;
  const flatFee = bigdecimal.BigDecimal(feeRange.flatFee.toString());
  const totalAmount = bigdecimal.BigDecimal(senderAmount.toString());
  const percentageFee = bigdecimal.BigDecimal(
    feeRange.percentageFee.toString(),
  );

  const totalFee = percentageFee
    .divide(bigdecimal.BigDecimal(100))
    .multiply(totalAmount)
    .setScale(2, bigdecimal.RoundingMode.HALF_UP())
    .add(flatFee)
    .floatValue();

  return totalFee;
};

export default calculateFee;
