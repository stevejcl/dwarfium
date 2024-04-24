import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";

export default function About() {
	useSetupConnection();
	useLoadIntialValues();

	return (
		
				<div className="row">
					<div className="col-md-12 text-center">
				<div className="footer">
				<p>Copyright Dwarfium &copy; 2024. All rights reserved. Made with <span style={{ color: "red" }}>&#10084;</span> for the DwarfII</p>
					</div></div>
				</div>
	
	);
}
