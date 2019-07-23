import React, { useEffect, useReducer, useState } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import queryString from 'query-string'
import {
  BlockDetailPanel,
  BlockTransactionsPagition,
  BlockRootInfoItemPanel,
  BlockMinerPanel,
  BlockOverviewItemContentPanel,
} from './styled'
import Content from '../../components/Content'
import TransactionItem from '../../components/Transaction/TransactionItem/index'
// import BlockHeightIcon from '../../assets/block_height_green.png'
// import BlockTransactionIcon from '../../assets/transactions_green.png'
// import ProposalTransactionsIcon from '../../assets/proposal_transactions.png'
// import TimestampIcon from '../../assets/timestamp_green.png'
// import UncleCountIcon from '../../assets/uncle_count.png'
// import MinerIcon from '../../assets/miner_green.png'
// import BlockRewardIcon from '../../assets/block_reward.png'
// import TransactionFeeIcon from '../../assets/transaction_fee.png'
// import DifficultyIcon from '../../assets/difficulty.png'
// import NonceIcon from '../../assets/nonce.png'
// import ProofIcon from '../../assets/proof.png'
// import EpochIcon from '../../assets/epoch.png'
// import StartNumberIcon from '../../assets/start_number.png'
// import LengthIcon from '../../assets/length.png'
// import PreviousBlockIcon from '../../assets/left_arrow.png'
// import PreviousBlockGreyIcon from '../../assets/left_arrow_grey.png'
// import NextBlockIcon from '../../assets/right_arrow.png'
// import NextBlockGreyIcon from '../../assets/right_arrow_grey.png'
// import MouseIcon from '../../assets/block_mouse.png'
// import TransactionsRootIcon from '../../assets/transactions_root.png'
// import WitnessRootIcon from '../../assets/witness_root.png'
import { parseSimpleDate } from '../../utils/date'
import { fetchBlock, fetchTransactionsByBlockHash } from '../../service/http/fetcher'
import { shannonToCkb } from '../../utils/util'
import { startEndEllipsis, parsePageNumber } from '../../utils/string'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile, isSmallMobile, isMediumMobile, isLargeMobile } from '../../utils/screen'
import AddressHashCard from '../../components/Card/AddressHashCard'
import TitleCard from '../../components/Card/TitleCard'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import Tooltip from '../../components/Tooltip'

enum PageParams {
  PageNo = 1,
  PageSize = 10,
  MaxPageSize = 100,
}

const initBlock: State.Block = {
  block_hash: '',
  number: 0,
  transactions_count: 0,
  proposals_count: 0,
  uncles_count: 0,
  uncle_block_hashes: [],
  reward: 0,
  reward_status: 'issued',
  received_tx_fee: 0,
  received_tx_fee_status: 'calculated',
  total_transaction_fee: 0,
  cell_consumed: 0,
  total_cell_capacity: 0,
  miner_hash: '',
  timestamp: 0,
  difficulty: '',
  start_number: 0,
  epoch: 0,
  length: '',
  version: 0,
  nonce: 0,
  proof: '',
  transactions_root: '',
  witnesses_root: '',
}

const Actions = {
  block: 'BLOCK',
  transactions: 'TRANSACTIONS',
  total: 'TOTAL',
  prev: 'PREV',
  next: 'NEXT',
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case Actions.block:
      return {
        ...state,
        block: action.payload.block,
      }
    case Actions.transactions:
      return {
        ...state,
        transactions: action.payload.transactions,
      }
    case Actions.total:
      return {
        ...state,
        total: action.payload.total,
      }
    case Actions.prev:
      return {
        ...state,
        prev: action.payload.prev,
      }
    case Actions.next:
      return {
        ...state,
        next: action.payload.next,
      }
    default:
      return state
  }
}

const getTransactions = (hash: string, page: number, size: number, dispatch: any) => {
  fetchTransactionsByBlockHash(hash, page, size).then(response => {
    const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
    dispatch({
      type: Actions.transactions,
      payload: {
        transactions: data,
      },
    })
    if (meta) {
      dispatch({
        type: Actions.total,
        payload: {
          total: meta.total,
        },
      })
    }
  })
}

const updateBlockPrevNext = (blockNumber: number, dispatch: any) => {
  dispatch({
    type: Actions.prev,
    payload: {
      prev: blockNumber > 0,
    },
  })
  fetchBlock(`${blockNumber + 1}`)
    .then((wrapper: Response.Wrapper<State.Block>) => {
      dispatch({
        type: Actions.next,
        payload: {
          next: wrapper ? wrapper.attributes.number > 0 : false,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: Actions.next,
        payload: {
          next: false,
        },
      })
    })
}

// blockParam: block hash or block number
const getBlock = (blockParam: string, page: number, size: number, dispatch: any, replace: any) => {
  fetchBlock(blockParam)
    .then((wrapper: Response.Wrapper<State.Block>) => {
      if (wrapper) {
        const block = wrapper.attributes
        dispatch({
          type: Actions.block,
          payload: {
            block,
          },
        })
        updateBlockPrevNext(block.number, dispatch)
        getTransactions(block.block_hash, page, size, dispatch)
      } else {
        replace(`/search/fail?q=${blockParam}`)
      }
    })
    .catch(() => {
      replace(`/search/fail?q=${blockParam}`)
    })
}

const initialState = {
  block: initBlock,
  transactions: [] as Response.Wrapper<State.Transaction>[],
  total: 1,
  prev: true,
  next: true,
}

const handleMinerText = (address: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(address, 11)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(address, 18)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(address, 23)
  }
  return startEndEllipsis(address)
}

const BlockMiner = ({ miner }: { miner: string }) => {
  return (
    <BlockMinerPanel>
      <Link to={`/address/${miner}`}>
        <code>{handleMinerText(miner)}</code>
      </Link>
    </BlockMinerPanel>
  )
}

const BlockOverviewItemContent = ({ value, tip, message }: { value?: string; tip?: string; message?: string }) => {
  const [show, setShow] = useState(false)
  return (
    <BlockOverviewItemContentPanel>
      {value && <div className="block__overview_item_value">{value}</div>}
      {tip && (
        <div
          id={tip}
          className="block__overview_item_tip"
          tabIndex={-1}
          onFocus={() => {}}
          onMouseOver={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {tip}
          <Tooltip show={show} targetElementId={tip}>
            {message}
          </Tooltip>
        </div>
      )}
    </BlockOverviewItemContentPanel>
  )
}

export default (props: React.PropsWithoutRef<RouteComponentProps<{ param: string }>>) => {
  const { match, location, history } = props
  const { params } = match
  // blockParam: block hash or block number
  const { param: blockParam } = params
  const { search } = location
  const { replace } = history
  const parsed = queryString.parse(search)
  const page = parsePageNumber(parsed.page, PageParams.PageNo)
  const size = parsePageNumber(parsed.size, PageParams.PageSize)

  const [state, dispatch] = useReducer(reducer, initialState)
  const [showAllOverview, setShowAllOverview] = useState(false)

  useEffect(() => {
    if (size > PageParams.MaxPageSize) {
      replace(`/block/${blockParam}?page=${page}&size=${PageParams.MaxPageSize}`)
    }
    getBlock(blockParam, page, size, dispatch, replace)
  }, [replace, blockParam, page, size, dispatch])

  const onChange = (pageNo: number, pageSize: number) => {
    history.push(`/block/${blockParam}?page=${pageNo}&size=${pageSize}`)
  }

  state.block.reward_status = 'pending'
  state.block.received_tx_fee_status = 'calculating'
  const receivedTxFee = `${localeNumberString(shannonToCkb(state.block.received_tx_fee))} CKB`
  const rootInfoItems = [
    {
      title: i18n.t('block.transactions_root'),
      content: `${state.block.transactions_root}`,
    },
    {
      title: i18n.t('block.witnesses_root'),
      content: `${state.block.witnesses_root}`,
    },
  ]

  let overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      content: localeNumberString(state.block.number),
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockMiner miner={state.block.miner_hash} />,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(state.block.transactions_count),
    },
    {
      title: i18n.t('block.epoch'),
      content: localeNumberString(state.block.epoch),
    },
    {
      title: i18n.t('block.proposal_transactions'),
      content: state.block.proposals_count ? localeNumberString(state.block.proposals_count) : 0,
    },
    {
      title: i18n.t('block.epoch_start_number'),
      content: localeNumberString(state.block.start_number),
    },
    {
      title: i18n.t('block.block_reward'),
      content: (
        <BlockOverviewItemContent
          value={`${localeNumberString(shannonToCkb(state.block.reward))} CKB`}
          tip={state.block.reward_status === 'pending' ? 'Pending' : undefined}
          message={i18n.t('block.pending_tip')}
        />
      ),
    },
    {
      title: i18n.t('block.epoch_length'),
      content: localeNumberString(state.block.length),
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      content: (
        <BlockOverviewItemContent
          value={
            state.block.received_tx_fee_status === 'calculating' && state.block.number > 0 ? undefined : receivedTxFee
          }
          tip={
            state.block.received_tx_fee_status === 'calculating' && state.block.number > 0 ? 'Calculating' : undefined
          }
          message={i18n.t('block.calculating_tip')}
        />
      ),
    },
    {
      title: i18n.t('block.difficulty'),
      content: localeNumberString(state.block.difficulty, 16),
    },
    {
      title: i18n.t('block.timestamp'),
      content: `${parseSimpleDate(state.block.timestamp)}`,
    },
    {
      title: i18n.t('block.nonce'),
      content: `${state.block.nonce}`,
    },
    {
      title: i18n.t('block.uncle_count'),
      content: `${state.block.uncles_count}`,
    },
    {
      title: i18n.t('block.proof'),
      content: `${startEndEllipsis(state.block.proof, 9)}`,
    },
  ]
  if (isMobile()) {
    const newItems: OverviewItemData[] = []
    overviewItems.forEach((item, idx) => (idx % 2 === 0 ? newItems.push(item) : null))
    overviewItems.forEach((item, idx) => (idx % 2 !== 0 ? newItems.push(item) : null))
    overviewItems = newItems.concat(rootInfoItems)
    if (!showAllOverview) {
      overviewItems.splice(11, overviewItems.length - 11)
    }
  }

  return (
    <Content>
      <BlockDetailPanel className="container">
        <AddressHashCard title={i18n.t('block.block')} hash={state.block.block_hash} />
        <TitleCard title={i18n.t('common.overview')} />
        <OverviewCard items={overviewItems}>
          {isMobile() ? (
            <button type="button" title="ShowAll" onClick={() => setShowAllOverview(!showAllOverview)} />
          ) : (
            rootInfoItems.map(item => {
              return (
                <BlockRootInfoItemPanel key={item.title}>
                  <div className="block__root_info_title">{item.title}</div>
                  <div className="block__root_info_value">{item.content}</div>
                </BlockRootInfoItemPanel>
              )
            })
          )}
        </OverviewCard>
        <TitleCard title={i18n.t('transaction.transactions')} />
        {state.transactions &&
          state.transactions.map((transaction: any, index: number) => {
            return (
              transaction && (
                <TransactionItem
                  key={transaction.attributes.transaction_hash}
                  transaction={transaction.attributes}
                  isBlock
                  isLastItem={index === state.transactions.length - 1}
                />
              )
            )
          })}
        <BlockTransactionsPagition>
          <Pagination
            showQuickJumper
            showSizeChanger
            defaultPageSize={size}
            pageSize={size}
            defaultCurrent={page}
            current={page}
            total={state.total}
            onChange={onChange}
            locale={localeInfo}
          />
        </BlockTransactionsPagition>
      </BlockDetailPanel>
    </Content>
  )
}
