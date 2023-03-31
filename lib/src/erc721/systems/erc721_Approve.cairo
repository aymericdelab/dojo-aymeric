
#[system]
mod ERC20_Approve {
    use traits::Into;
    use starknet::ContractAddress;
    use dojo::storage::key::StorageKey;

    fn execute(to: ContractAddress, token_id: felt252) {
        let caller = starknet::get_caller_address();

        let approval_sk: StorageKey = (to, (caller.into(), token_id)).into();

        let approval = commands::<Approval>::get(approval_sk);

        commands::set(approval_sk, (
            Approval { to: to, token_id: token_id }
        ))
    }
}
