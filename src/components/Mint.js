import { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Mint = ({
	provider, nft, cost, setIsLoading
}) => {
	const [isWating, setIsWating] = useState(false);
	const [mintAmount, setMintAmount] = useState(1);
	const mintHandler = async (e) => {
		e.preventDefault()
		setIsWating(true)

		try{
			const signer = await provider.getSigner()
			const transaction = await nft.connect(signer).mint(1, {value: cost})
			await transaction.wait()
		}catch{
			window.alert('User rejected or transaction reverted')
		}

		setIsLoading(true);
	}
	
	return(
		<Form 
			onSubmit={mintHandler}
			style={{maxWidth: '450px', margin: '50px auto'}}>
			{isWating ? (
				<Spinner animation="border" style={{display: 'block', margin: '0 auto'}}/>
			) : (
			<>
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
						style={{width: '100%'}}>
						Mint
					</Button>
				</Form.Group>
			</>
			)}
		</Form>
	)
}

export default Mint;