import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {AnnAHeiM} from '../target/types/AnnAHeiM'

describe('AnnAHeiM', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.AnnAHeiM as Program<AnnAHeiM>

  const AnnAHeiMKeypair = Keypair.generate()

  it('Initialize AnnAHeiM', async () => {
    await program.methods
      .initialize()
      .accounts({
        AnnAHeiM: AnnAHeiMKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([AnnAHeiMKeypair])
      .rpc()

    const currentCount = await program.account.AnnAHeiM.fetch(AnnAHeiMKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment AnnAHeiM', async () => {
    await program.methods.increment().accounts({ AnnAHeiM: AnnAHeiMKeypair.publicKey }).rpc()

    const currentCount = await program.account.AnnAHeiM.fetch(AnnAHeiMKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment AnnAHeiM Again', async () => {
    await program.methods.increment().accounts({ AnnAHeiM: AnnAHeiMKeypair.publicKey }).rpc()

    const currentCount = await program.account.AnnAHeiM.fetch(AnnAHeiMKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement AnnAHeiM', async () => {
    await program.methods.decrement().accounts({ AnnAHeiM: AnnAHeiMKeypair.publicKey }).rpc()

    const currentCount = await program.account.AnnAHeiM.fetch(AnnAHeiMKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set AnnAHeiM value', async () => {
    await program.methods.set(42).accounts({ AnnAHeiM: AnnAHeiMKeypair.publicKey }).rpc()

    const currentCount = await program.account.AnnAHeiM.fetch(AnnAHeiMKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the AnnAHeiM account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        AnnAHeiM: AnnAHeiMKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.AnnAHeiM.fetchNullable(AnnAHeiMKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
