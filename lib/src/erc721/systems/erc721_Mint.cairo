#[system]
mod ERC721_Mint {
    use traits::Into;
    use starknet::ContractAddress;

    use dojo::storage::key::StorageKey;

    #[external]
    #[raw_output]
    fn execute(token_address: ContractAddress, to: ContractAddress, token_id: u256) {
        assert(!to.is_zero(), 'ERC721: invalid receiver');
        assert(!_exists(token_id), 'ERC721: token already minted');

        let owner_sk: StorageKey = (token_address, (to)).into();

        let owner = commands::<Owner>::get(approval_sk);

        commands::set(owner_sk, (Owner { token_id: to, balance: owner.balance + 1 }));
    }
}
