#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod AnnAHeiM {
    use super::*;

  pub fn close(_ctx: Context<CloseAnnAHeiM>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.AnnAHeiM.count = ctx.accounts.AnnAHeiM.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.AnnAHeiM.count = ctx.accounts.AnnAHeiM.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeAnnAHeiM>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.AnnAHeiM.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeAnnAHeiM<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + AnnAHeiM::INIT_SPACE,
  payer = payer
  )]
  pub AnnAHeiM: Account<'info, AnnAHeiM>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseAnnAHeiM<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub AnnAHeiM: Account<'info, AnnAHeiM>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub AnnAHeiM: Account<'info, AnnAHeiM>,
}

#[account]
#[derive(InitSpace)]
pub struct AnnAHeiM {
  count: u8,
}
