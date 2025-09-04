import React from "react"
import { Box, Grid, Typography, Container } from "@mui/material"
import Certificate from "./Certificate" // کامپوننت اصلی شما

// ۱. عکس‌های گواهینامه‌های خود را در اینجا وارد کنید
// مسیر فایل‌ها را مطابق با پروژه خودتان تنظیم کنید
import certImage1 from "../assets/certificates/my-cert-1.png"
import certImage2 from "../assets/certificates/my-cert-2.jpg"
// import certImage3 from '../assets/certificates/my-cert-3.png'; // هر تعداد که دارید اضافه کنید

// ۲. یک لیست از عکس‌های وارد شده بسازید
const certificatesData = [
	{ id: 1, image: certImage1 },
	{ id: 2, image: certImage2 },
	// { id: 3, image: certImage3 },
]

const CertificatesList = () => {
	return (
		<Container maxWidth="lg" sx={{ py: 5 }}>
			<Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: "bold", mb: 5 }}>
				My Certificates
			</Typography>
			<Grid container spacing={4} justifyContent="center">
				{/* ۳. به ازای هر آیتم در لیست، یک کامپوننت Certificate ساخته می‌شود */}
				{certificatesData.map(cert => (
					<Grid item xs={12} sm={6} md={4} key={cert.id}>
						<Certificate ImgSertif={cert.image} />
					</Grid>
				))}
			</Grid>
		</Container>
	)
}

export default CertificatesList

