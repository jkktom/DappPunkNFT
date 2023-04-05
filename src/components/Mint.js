import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Mint = ({
	provider, nft, cost, setIsLoading, isWhitelisted
}) => {
	const [isWating, setIsWating] = useState(false);
	const [mintAmount, setMintAmount] = useState(1);

	const mintHandler = async (e) => {
		e.preventDefault()
		setIsWating(true)

		const mintAmountInt = parseInt(mintAmount);

		try{
			const signer = await provider.getSigner()
			const totalValue = BigNumber.from(cost).mul(mintAmountInt);
			const transaction = await nft.connect(signer).mint(mintAmountInt, { value: totalValue });
			await transaction.wait()
		}catch(error){
			console.error('Error', error);
			window.alert('User rejected or transaction reverted');
		}

		setIsLoading(true);
	}
	
	return(
		<Form 
			onSubmit={mintHandler}
			style={{maxWidth: '450px', margin: '50px auto'}}>
			<Form.Group className="mb-3">
				<Form.Label>Number of NFTs to mint:</Form.Label>
				<Form.Control
					type="number"
					min="1"
					value={mintAmount}
					onChange={(e) => setMintAmount(e.target.value)} />
			</Form.Group>
			<Form.Group>
				<Button 
					variant="primary" 
					type="submit"
					style={{width: '100%'}}
					disabled={!isWhitelisted}>
					Mint
				</Button>
			</Form.Group>
			{isWating && (
				<div className="text-center">
					<Spinner animation="border" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
				</div>
			)}
		</Form>
	)
}

export default Mint;
