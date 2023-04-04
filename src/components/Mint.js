import { ethers } from 'ethers'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Mint = ({
	provider, nft, cost, setIsLoading
}) => {
	const mintHandler = async (e) => {
		e.preventDefault()
		try{
			const signer = await provider.getSigner()
			const transaction = await nft.connect(signer).mint(1, {value: cost})
			await transaction.wait()
		}catch{
			window.alert('User rejected or transaction reverted')
		}
	}
	
	return(
		<Form 
			onSubmit={mintHandler}
			style={{maxWidth: '450px', margin: '50px auto'}}>
			<Button 
				variant="primary"
				type="submit"
				style={{width: '100%'}}>
				Mint
			</Button>
		</Form>
	)
}

export default Mint;