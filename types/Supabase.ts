export interface Users {
  id: string
  created_at: number
  checkout_session_ids: string[]
  stripe_subscription_id: string
  stripe_current_period_end: number
  is_premium: boolean
  stripe_subscription_status: string
  stripe_subscription_cancel_at_period_end: boolean
  stripe_customer_id: string
  user_id: string
}
