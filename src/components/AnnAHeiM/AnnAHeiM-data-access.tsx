'use client'

import { getAnnAHeiMProgram, getAnnAHeiMProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useAnnAHeiMProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getAnnAHeiMProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getAnnAHeiMProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['AnnAHeiM', 'all', { cluster }],
    queryFn: () => program.account.AnnAHeiM.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['AnnAHeiM', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ AnnAHeiM: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useAnnAHeiMProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useAnnAHeiMProgram()

  const accountQuery = useQuery({
    queryKey: ['AnnAHeiM', 'fetch', { cluster, account }],
    queryFn: () => program.account.AnnAHeiM.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['AnnAHeiM', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ AnnAHeiM: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['AnnAHeiM', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ AnnAHeiM: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['AnnAHeiM', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ AnnAHeiM: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['AnnAHeiM', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ AnnAHeiM: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
