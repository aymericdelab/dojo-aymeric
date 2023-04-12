#[system]
mod ERC20_Approve {
    use traits::Into;
    use array::ArrayTrait;
    use starknet::ContractAddress;
    use dojo_erc::erc20::components::Approval;

    fn execute(token_id: felt252, spender: ContractAddress, amount: felt252) {
        let caller = starknet::get_caller_address();
        let approval_sk: Query = (token_id, (caller.into(), spender.into())).into();
        let approval = commands::<Approval>::entity(approval_sk);
        commands::set_entity(approval_sk, (
            Approval { amount: amount }
        ))
    }
}

#[system]
mod ERC20_TransferFrom {
    use traits::Into;
    use array::ArrayTrait;
    use zeroable::Zeroable;

    use dojo_erc::erc20::components::Approval;
    use dojo_erc::erc20::components::Balance;
    use starknet::ContractAddress;
    use starknet::ContractAddressZeroable;

    fn execute(token_address: ContractAddress, spender: ContractAddress, recipient: ContractAddress, amount: felt252) {
        assert(!spender.is_zero(), 'ERC20: transfer from 0');
        assert(!recipient.is_zero(), 'ERC20: transfer to 0');
        let caller = starknet::get_caller_address();

        let spender_ownership_sk: Query = (token_address, (spender)).into();
        let recipient_ownership_sk: Query = (token_address, (recipient)).into();

        let spen_ownershipder = commands::<Balance>::entity(spender_ownership_sk);
        commands::set_entity(spender_ownership_sk, (
            Balance { amount : spen_ownershipder.amount - amount}
        ));

        let recipient_ownership = commands::<Balance>::entity(recipient_ownership_sk);
        commands::set_entity(recipient_ownership_sk, (
            Balance { amount : recipient_ownership.amount + amount}
        ));

        // update allowance
        let approval_sk_transfer: Query = (token_address.into(), (caller.into(), spender.into())).into();
        let approval_transfer = commands::<Approval>::entity(approval_sk_transfer);
        
        commands::set_entity(approval_sk_transfer, (
            Approval { amount: approval_transfer.amount - amount }
        ))
    }
}
