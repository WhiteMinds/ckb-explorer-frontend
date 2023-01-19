export enum AppActions {
  ResizeWindow = 'resizeWindow',
  UpdateModal = 'updateModal',
  ShowToastMessage = 'showToastMessage',
  UpdateAppErrors = 'updateAppErrors',
  UpdateTipBlockNumber = 'updateTipBlockNumber',
  UpdateAppLanguage = 'updateAppLanguage',
  UpdateHardForkStatus = 'updateHardForkStatus',
}

export enum PageActions {
  UpdateStatistics = 'updateStatistics',

  UpdateStatisticTransactionCount = 'updateStatisticTransactionCount',
  UpdateStatisticTransactionCountFetchEnd = 'updateStatisticTransactionCountFetchEnd',
  UpdateStatisticAddressCount = 'updateStatisticAddressCount',
  UpdateStatisticAddressCountFetchEnd = 'updateStatisticAddressCountFetchEnd',
  UpdateStatisticTotalDaoDeposit = 'updateStatisticTotalDaoDeposit',
  UpdateStatisticTotalDaoDepositFetchEnd = 'updateStatisticTotalDaoDepositFetchEnd',
  UpdateStatisticNewDaoDeposit = 'updateStatisticNewDaoDeposit',
  UpdateStatisticNewDaoDepositFetchEnd = 'updateStatisticNewDaoDepositFetchEnd',
  UpdateStatisticNewDaoWithdraw = 'updateStatisticNewDaoWithdraw',
  UpdateStatisticNewDaoWithdrawFetchEnd = 'updateStatisticNewDaoWithdrawFetchEnd',
  UpdateStatisticCirculationRatio = 'updateStatisticCirculationRatio',
  UpdateStatisticCirculationRatioFetchEnd = 'updateStatisticCirculationRatioFetchEnd',
  UpdateStatisticCellCount = 'updateStatisticCellCount',
  UpdateStatisticCellCountFetchEnd = 'updateStatisticCellCountFetchEnd',
  UpdateStatisticAddressBalanceRank = 'updateStatisticAddressBalanceRank',
  UpdateStatisticAddressBalanceRankFetchEnd = 'updateStatisticAddressBalanceRankFetchEnd',
  UpdateStatisticBalanceDistribution = 'updateStatisticBalanceDistribution',
  UpdateStatisticBalanceDistributionFetchEnd = 'updateStatisticBalanceDistributionFetchEnd',
  UpdateStatisticTxFeeHistory = 'updateStatisticTxFeeHistory',
  UpdateStatisticTxFeeHistoryFetchEnd = 'updateStatisticTxFeeHistoryFetchEnd',
  UpdateStatisticBlockTimeDistribution = 'updateStatisticBlockTimeDistribution',
  UpdateStatisticBlockTimeDistributionFetchEnd = 'updateStatisticBlockTimeDistributionFetchEnd',
  UpdateStatisticAverageBlockTime = 'updateStatisticAverageBlockTime',
  UpdateStatisticAverageBlockTimeFetchEnd = 'updateStatisticAverageBlockTimeFetchEnd',
  UpdateStatisticOccupiedCapacity = 'updateStatisticOccupiedCapacity',
  UpdateStatisticOccupiedCapacityFetchEnd = 'updateStatisticOccupiedCapacityFetchEnd',
  UpdateStatisticEpochTimeDistribution = 'updateStatisticEpochTimeDistribution',
  UpdateStatisticEpochTimeDistributionFetchEnd = 'updateStatisticEpochTimeDistributionFetchEnd',
  UpdateStatisticEpochLengthDistribution = 'updateStatisticEpochLengthDistribution',
  UpdateStatisticEpochLengthDistributionFetchEnd = 'updateStatisticEpochLengthDistributionFetchEnd',
  UpdateStatisticNewNodeCount = 'updateStatisticNewNodeCount',
  UpdateStatisticNewNodeCountFetchEnd = 'updateStatisticNewNodeCountFetchEnd',
  UpdateStatisticNodeDistribution = 'updateStatisticNodeDistribution',
  UpdateStatisticNodeDistributionFetchEnd = 'updateStatisticNodeDistributionFetchEnd',
  UpdateStatisticTotalSupply = 'updateStatisticTotalSupply',
  UpdateStatisticTotalSupplyFetchEnd = 'updateStatisticTotalSupplyFetchEnd',
  UpdateStatisticAnnualPercentageCompensation = 'UpdateStatisticAnnualPercentageCompensation',
  UpdateStatisticAnnualPercentageCompensationFetchEnd = 'UpdateStatisticAnnualPercentageCompensationFetchEnd',
  UpdateStatisticSecondaryIssuance = 'updateStatisticSecondaryIssuance',
  UpdateStatisticSecondaryIssuanceFetchEnd = 'updateStatisticSecondaryIssuanceFetchEnd',
  UpdateStatisticInflationRate = 'updateStatisticInflationRate',
  UpdateStatisticInflationRateFetchEnd = 'updateStatisticInflationRateFetchEnd',
  UpdateStatisticLiquidity = 'updateStatisticLiquidity',
  UpdateStatisticLiquidityFetchEnd = 'updateStatisticLiquidityFetchEnd',
}

export enum ComponentActions {
  UpdateHeaderSearchEditable = 'updateHeaderSearchEditable',
  UpdateHeaderMobileMenuVisible = 'updateHeaderMobileMenuVisible',
  UpdateHeaderSearchBarVisible = 'updateHeaderSearchBarVisible',
  UpdateMaintenanceAlertVisible = 'updateMaintenanceAlertVisible',
}

export type StateActions = AppActions | PageActions | ComponentActions

// eslint-disable-next-line no-undef
export default StateActions
