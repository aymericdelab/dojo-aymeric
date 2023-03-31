#[system]
mod ERC721_Transfer {
    use traits::Into;
    use starknet::ContractAddress;

    use dojo::storage::key::StorageKey;
    
    #[external]
    #[raw_output]
    fn execute(from: ContractAddress, to: ContractAddress, token_id: u256) {
        // TODO
    }
}
