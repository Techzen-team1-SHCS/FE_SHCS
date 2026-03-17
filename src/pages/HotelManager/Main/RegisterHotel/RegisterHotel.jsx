import { useState } from "react"
import Step1Property from "../../Components/registerHotel/Step1Property/Step1Property"
import Step2Amenities from "../../Components/registerHotel/Step2Amenities/Step2Amenities"
import Step3Photo from "../../Components/registerHotel/Step3Photo/Step3Infor"
import styles from "./RegisterHotel.module.css"
function RegisterHotel() {

const [step, setStep] = useState(1)

const nextStep = () => {
  setStep(step + 1)
}

const prevStep = () => {
  setStep(step - 1)
}

return (
  <div className={styles.container}>

    {step === 1 && <Step1Property nextStep={nextStep} />}

    {step === 2 && (
      <Step2Amenities 
        nextStep={nextStep}
        prevStep={prevStep}
      />
    )}

    {step === 3 && (
      <Step3Photo 
        prevStep={prevStep}
      />
    )}

  </div>
)

}

export default RegisterHotel