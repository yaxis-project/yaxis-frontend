import { getBalanceNumber } from '../utils/formatBalance';
import useAllEarnings from './useAllEarnings';
import usePriceMap from "./usePriceMap";

/**
 * Generates the signed in user's yax returns.
 */
export default function useAccountReturns() {
  const { YAX: yaxisPrice } = usePriceMap();
  const { totalAmount } = useAllEarnings();

  const yaxReturns = getBalanceNumber(totalAmount);
  return { yaxReturns, yaxReturnsUSD: totalAmount.times(yaxisPrice).toNumber() };
}