// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import AnnAHeiMIDL from '../target/idl/AnnAHeiM.json'
import type { AnnAHeiM } from '../target/types/AnnAHeiM'

// Re-export the generated IDL and type
export { AnnAHeiM, AnnAHeiMIDL }

// The programId is imported from the program IDL.
export const ANN_AHEI_M_PROGRAM_ID = new PublicKey(AnnAHeiMIDL.address)

// This is a helper function to get the AnnAHeiM Anchor program.
export function getAnnAHeiMProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...AnnAHeiMIDL, address: address ? address.toBase58() : AnnAHeiMIDL.address } as AnnAHeiM, provider)
}

// This is a helper function to get the program ID for the AnnAHeiM program depending on the cluster.
export function getAnnAHeiMProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the AnnAHeiM program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return ANN_AHEI_M_PROGRAM_ID
  }
}
