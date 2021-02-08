import React from 'react';

import { ExpandableSidePanel, ExpandableRow } from '../../../components/ExpandableSidePanel';
import useTVL from '../../../hooks/useComputeTVL';
import Value from '../../../components/Value'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import useMetaVault from '../../../hooks/useMetaVault';

/**
 * Generates investing vault stats card for the current signed in user.
 */
export default function () {
  const { tvl } = useTVL();
  const { metaVaultData } = useMetaVaultData('v1');
  const { strategy } = useMetaVault();
  return (<>
    <ExpandableSidePanel header="Vault Stats" key="1">
      <ExpandableRow
        main="Current Strategy"
        secondary={strategy}
      />
      <ExpandableRow
        main="Total Value Locked"
        secondary={
          <Value value={tvl.toNumber()} numberPrefix="$" decimals={2} />
        }
      />
      <ExpandableRow
        main="Rewards Per Block"
        secondary={
          <Value value={metaVaultData?.rewardPerBlock} numberSuffix=" YAX" decimals={3} />
        }
      />
    </ExpandableSidePanel>
  </>)
}