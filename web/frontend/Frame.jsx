import Routes from "./Routes";
import {
    TopBar,
    Navigation,
    Loading,
    FormLayout,
    TextField,
    Modal,
    AppProvider,
    Frame,
    Toast,
  } from "@shopify/polaris";
  import {HomeMajor, SettingsMinor,CustomersMajor,MobileHamburgerMajor,CreditCardMajor,CircleTickMajor, ProfileMajor} from "@shopify/polaris-icons";
  import { useCallback, useEffect, useRef, useState } from "react";
  import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "./pages/components/Alert";
  export default function FrameHome(){
  const [customers, setCustomers] = useState({});
  const [billing, setBilling] = useState({});
  const navigate = useNavigate();
    useEffect(() => {
      getCustomers();
      getPaymentList();
      }, [])
      const getCustomers = ()=>{
      axios.get(`/api/get-length?shop=${Shop_name}`).then((res)=>{
        setCustomers(res.data);
      });
      }
      
   const getPaymentList = () =>{
    axios.get(`/api/get-billing?shop=${Shop_name}`).then((response) => {
      setBilling(response.data);
    });
  }
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
    const defaultState = useRef({
      emailFieldValue: 'mandasadeveloper@gmail.com',
      nameFieldValue: 'Mandasa Technologies',
    });
    const skipToContentRef = useRef(null);
    const [toastActive, setToastActive] = useState(false);
    const isLoading = false;
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [nameFieldValue, setNameFieldValue] = useState(
      defaultState.current.nameFieldValue,
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
      defaultState.current.emailFieldValue,
    );
    const [storeName, setStoreName] = useState(
      defaultState.current.nameFieldValue,
    );
    const [supportSubject, setSupportSubject] = useState('');
    const [supportMessage, setSupportMessage] = useState('');
  
    const handleSubjectChange = useCallback(
      (value) => setSupportSubject(value),
      [],
    );
    const handleMessageChange = useCallback(
      (value) => setSupportMessage(value),
      [],
    );
    const handleDiscard = useCallback(() => {
      setEmailFieldValue(defaultState.current.emailFieldValue);
      setNameFieldValue(defaultState.current.nameFieldValue);
    }, []);
    
    const handleSave = useCallback(() => {
      defaultState.current.nameFieldValue = nameFieldValue;
      defaultState.current.emailFieldValue = emailFieldValue;
  
      setToastActive(true);
      setStoreName(defaultState.current.nameFieldValue);
    }, [emailFieldValue, nameFieldValue]);
  
    const toggleToastActive = useCallback(
      () => setToastActive((toastActive) => !toastActive),
      [],
    );
    const toggleUserMenuActive = useCallback(
      () => setUserMenuActive((userMenuActive) => !userMenuActive),
      [],
    );
    const toggleMobileNavigationActive = useCallback(
      () =>
        setMobileNavigationActive(
          (mobileNavigationActive) => !mobileNavigationActive,
        ),
      [],
    );
  
    const toggleModalActive = useCallback(
      () => setModalActive((modalActive) => !modalActive),
      [],
    );
  
    const toastMarkup = toastActive ? (
      <Toast onDismiss={toggleToastActive} content="Changes saved" />
    ) : null;
  
    const userMenuActions = [
      {
        items: [{content: 'Community forums'}],
      },
    ];
    
    const userMenuMarkup = (
      <TopBar.UserMenu
        actions={userMenuActions}
        name="My Public App"
        detail={storeName}
        initials="M"
        open={userMenuActive}
        onToggle={toggleUserMenuActive}
      />
    );
  
    const topBarMarkup = (
      <TopBar
        showNavigationToggle
        userMenu={userMenuMarkup}
        onNavigationToggle={toggleMobileNavigationActive}
      />
    );
  
    const navigationMarkup = (
      <Navigation className="sdsd">
        <Navigation.Section
          items={[
            {
              key:1,
              label:"Dashboard",
              icon: HomeMajor,
              onClick:()=>navigate('/', {replace: true})
            },
            {    
              key:2,        
              label:"Customers",
              icon: CustomersMajor,
              onClick:()=>navigate('/components/customers/customers', {replace: true})

            },
            {
              key:3,       
              label:"Profile Setup",         
              icon: ProfileMajor,
              onClick:()=>navigate('/components/profileSetup/profilesetup', {replace: true})

            },
            { 
              key:4,       
              label:"Menu Builder",           
              icon: MobileHamburgerMajor,
              onClick:()=>navigate('/components/menu-builder/menubuilder', {replace: true})

            },
            {
              key:5,       
              label:"Toggle Feature",           
              icon: CircleTickMajor,
              onClick:()=>navigate("/components/togglefeature", {replace: true})

            },
            {
              key:6,       
              label:"Plan",
              onClick:()=>navigate('/components/billing/plan', {replace: true}),
              icon: CreditCardMajor,
            },
            {
              key:7,       
              label:"Setting",           
              icon: SettingsMinor,
              onClick:()=>navigate('/components/setting/setting', {replace: true})
            },
          ]}
        />
      </Navigation>
    );
  
    const loadingMarkup = isLoading ? <Loading /> : null;
    const modalMarkup = (
      <Modal
        open={modalActive}
        onClose={toggleModalActive}
        title="Contact support"
        primaryAction={{
          content: 'Send',
          onAction: toggleModalActive,
        }}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Subject"
              value={supportSubject}
              onChange={handleSubjectChange}
              autoComplete="off"
            />
            <TextField
              label="Message"
              value={supportMessage}
              onChange={handleMessageChange}
              autoComplete="off"
              multiline
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    );
  
    const logo = {
      width: 30,
      topBarSource:
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAPERAPDxANEA4QEBAQEBUQFw8QEA0THBUYFhcXFxkYHiklGBonHRcTITEtJyssLjovFx8zRDMtNygvMTcBCgoKDg0OGhAQGC8lHx03LywrLS0uNy0tLSsuLSsuLS0tNzcrKzUuKzc4MS83LSstLS03Mi0tNy0tLS0tKystLf/AABEIAMgAyAMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABwgFBgEDBAL/xABAEAACAQIBBgYRAwUBAQAAAAAAAQIDBBEFBgcSITFBUWFxgZETFCIjNDVCUnJzdKGxsrPBwjIzYmOCktHw4UP/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAQUGBAMC/8QAKBEBAAIBAgUEAwEBAQAAAAAAAAECAwQRBRITITEyQVFxYYGxocEi/9oADAMBAAIRAxEAPwCcQAAAAAAAAAAAAHBiKuU9S9hbt9zVo60eSalL4rHqMuRznleunfwqR/VRjS+Ll8H7zk1ebo0i35h0abF1bTX8SkcHVQqqcYzjtjKKkuZrE7Tqid4c4ACQAAAAAAAAAAAAAAAAAAAAAAAAAAHBEWclx2W6rz/qOK5o9z9iVMp3So0alV+RCUunDYQzKTbbe1t4v4lJxjJ2rT9rbhdO9rfpKGZF32W0gm9tNum+jd7mjPmi6NrnbXpPijUXwf4m9FhosnPgrLh1dOTNaHIAOtzgAAAAAAAAAAAAAAAAAAAAAAAAB8ykkm3sS2ganpDv9SjGgn3VWWMvRjt+OHUR4ZPOPKXbVxOpi9RdxT9Fbuva+kxhktdm6uaZjx4hpdHi6WKInzLYcxK+peRXnwnD3a34knkP5v1dS6t5f1YLob1X8WTAW/CL74pj4lV8TrtlifmHIALZXAAAAAAAAAAAAAAAAAAAAAAAAODUc+8tqnDtam++VF3zDyYcXT8MTYsrX0bejOtLyFsXnPgXXgRBc3Eqs5VJtuc222VXE9V06clfM/xYcP03Utz28R/XUADNL92UJ6soy82Sl1PEmtbiECa7V9xDHfqRx6i+4NPrj6U/FY9M/f8Ax3AAvFQAAAAAAAAAAAAAAAAAADXM5cpzs6lCusZUp406sePhi1y/qM3aXMK0I1KclKElimjX9INPG1T82rB/Ffc1PNfOCVnPCWMqE33cfN/kisyavo6jkv6Z2/Tvpperg5q+Y/1KYOu3rRqRjODUoSWKa3NGJzpyyrSi2muzTxjTXL53Mv8AR33y1pSbzPZx0pa1orHlqufuV+y1FbwfcUnjPDyp/wDn3ZqZzKTbbbbbeLb3t/dnBkNRmnNkm8+7T4MUYqRWAAHg9XZb03OUYLfKSiul4E1xWCREua1v2S7oR4FPXf8Ab3XxSJbNDwem1LW+VJxS2961+HIALlVgAAAAAAAAAAAAAAAAAA1vP6WFpJcdSCXWRkb9pIucKdGlwym5vmisPyNBMxxW2+f6hoOG12w7/Ms/m3nJO0xhJOpReLUcdsJcax4DGZWylUuqjq1HtexJboR4Ev8AuE8YOO2oyWpGOZ7Q6q4KRebxHeQAHg9QAEjcNHNnrVKtZ7oRUFzvb8F7yQDCZn2HYLWmmsJ1O+S6d3u1TNmu0OLp4Kx7+WZ1eTqZbTDkAHW5gAAAAAAAAAAAAAAAHAB5so3Ko0qlV7oQlLnwR82mIjdMRvOyM88b/s91Uw/TT71Ho3+/Ewh9Tm5Nye1ybb5z5MZmyTkvNp92qxUilIrHsAA8noAAAZTNrJvbNxCnhjBPXqeiv9vBdJiyT8zMj9rUdaawq1cJS44x8mP/AHGd2g0/Wyxv4jy5Nbn6WOdvM+GwpHIBrGbAAAAAAAAAAAAAAAAAABwadpCyoo0420X3VRqU+SCezrfwZt1Wooxcm8FFNt8SRDuVr53FapWflyxSfBHcl1YFZxPUdPFyx5t/Hfw/Dz5OafFXkABmGgADMZtZEleVcHspQwdR8nmrlZ64sdslorXzL4yXjHWbW8Q+ciZv17t4wSjTW+csVHo842+zzGt44dlnUqvh26kepbfebPQoxpxUIJRjFYJLYkjsNJg4bixx/wCo3lQZtflvPadoYahmvZwlGUaKxi003Kctu/he0zJ8zmopyk0opYtvBJLlI+zk0p29Byp2cO2KixWu8Y0U+Thn7uc7qY6U9MbOS17X9U7pEBAV7pIypVeKrxpR82lCmkumSb9500NIOVIPHtqUuScKUl8p9o2WDBE+QdLTxUL6isNzqUcU1yuD39D6CTcm5Qo3NONahUjUpy3OPwfE+QIesHVcV404ynOUYQisZSk1GMVyt7iN84tK9Om3TsaarSWzslTGNPoitsl1ASaCv93pFypUePbPY1xU4UopdaxOLbSHlSm8e2XNcVSFKSfu2BOywIIuzf0sxk1C+pKGOzslHFxXPB7UuZvmJJs7unWhGrSnCpTksYyg000EPQAAAAAAADXc+L3sVrKK/VVaprm3y9yfWRgbhpHucatGlwQg5vnk8PxNPMvxPJz55j47NDw/Hy4d/kABWu4JTzLs1StKb8qpjUly47vdgRYS7mxUUrS3a4KUY9Sw+xccHiJyzP4VnFJnpxH5ZQ4bw2vccml6Vctu1snTg8KtzLsSa3qG+b6sF/caJRtC0jZ7TvKkra3k42cG02sV2zJbMX/DiXTzaKCTdGWY0K8Y313HWpt94pv9M8HhryXCuJchCWjZMzdvLpa1vbV6kfOUWof5PYz0XeaGUaMdadncaq3uK18P8ccCxsIJJJJJLYktiR9Em6qrWBnM0s562TqyqU25UpNdmp+TUj9pb8GSvn5mNSvYTrUIxp3kVinHCMbj+M8OHiZBs4OLcWmmng096e7oZA2vPrPWplKepDXp2kWnCDw1pvzp4cO/ZwGpAlrRrmLT7HC9vIKc5pToU5LGMI71OSe9veugCPMnZs31zHWo2tecOCWq4wfM5bGfV/mpf0I69W0uIwW9qLmlzuOOBZFI5JN1VDZcys7auTavDO2m++0/yjxS+OBIOkXMWnXpzu7WChcwTlUjBYRrx3vZwT385DJAtHZ3UK1OFWnJTp1IqUWtzT2noIv0L5bcoVrGbx7H36jjwRbwmubFp/3MlAlAAAAAAivPaprXtX+KhFf4p/dmCMxnd4ZX9KPyxMOY3VTvmv8ActTp42xV+oAD7o0pTkoQTlKTwSW9s8YjftD1mdu8vgkPR5eOdCdF496ninwastuHXrdZ5sk5jRwUrmbct+pDYlzy4ejA2vJuTqVtHUox1It4va22+PFl5w/RZsd4yW7R/qn1urxZKcle8vWQ7puuG7m2p8EKDmueU2n8qJjIV01+G0fZYfUmXiqhoVCm5yjBb5SUV0vAtBZ20aNOnSgsIU4RhFcSSwRWXJn71H1tP5kWhBIAAgK+6TLKNHKVyorCM3CrhyyipS9+sWCIH0t+M6nqqPyhMNZyLaqtc29F7qtelTfNKaj9yzkIqKSSSSSSS3Jbiteanh1l7ZbfViWWBIAAgK1532caF9d0o7IRrT1VxRb1kveuosoV10g+Mrz1v4oJh69Flw4ZTt0scJqrCXKtRv4pE/letG3jOz9Of05FhQSAAIAABGGfdo6d3KXk1YxmufDVfTs95rpKGemSe2aGtBY1aOM48cl5Uf8AuIi8yvEcE480z7T3aLQZoviiPeOwb7o9yXFQlcyWMpNwp/xitjfS8eo0IlTMpp2VHD+pjz68j04VSLZt59ofHErzXFtHvLOgA0ygCFdNfhtH2WH1Jk1EK6a/DaPssPqTCYaRkz96j62n8yLQlXsmfvUfW0/mRaEEgACAgfS34zqeqo/KTwQPpb8Z1PVUflCYYHNTw6y9stvqxLLFac1PDrL2y2+rEssCQABAV10g+Mrz1v4osUV10g+Mrz1v4oJh26NvGdn6c/pyLCletG3jOz9Of05FhQSAAIAABxgRtnrkLsFTs9Nd5qPal/8AOfFzPaSSdN3bRqwlTmlKElg0zl1emjPj5Z8+zo02ecN+aPHuhU3XR9lZRcrWbw1m5UsePhj9+swGcWRJ2dTVeLpS205ca4nynTm/burc0ILhqRb5l3T9yZndPOTT6iI2777LzPyZsEzv28phAQNYzYQrpr8No+yw+pMmohXTX4bR9lh9SYTDSMmfvUfW0/mRaEq9kz96j62n8yLQgkAAQED6W/GdT1VH5SeCB9LfjOp6qj8oTDA5qeHWXtlt9WJZYrTmp4dZe2W31YllgSAAICuukHxleet/FFiiuukHxleet/FBMO3Rt4zs/Tn9ORYUr1o28Z2fpz+nIsKCQABAAAAAA8eU7Cnc05Uqixi+uL4GuJmq5tZvVLa8k6ixhCnJ05rdLF4Lpw1tgBzZcFLXreY7w98ea9a2pE9pbsADpeARXpTzavLy6pVLahOrCNvGDacFhLXm8Nr5UABqdhmNlONWlKVpUSjUhJvWpbFjt8osAAEgACAiDSRmpfXV9Otb286lJ06aUk4JYqOD3sADEZvZlZSpXdpUqWtSNOnc0JzbdJ6sY1E29j4sSdgAkAAQEJ555nZQr31zWpW050qlTWjJOnhJYJcL5zgAdmY2aGULe/tq1a2nClCUnKTdPCPcSS3PlRNIAAAAf//Z',
      url: '/',
      accessibilityLabel: 'mandasa logo',
    };
  
    return (
      <div style={{height: '500px'}}>
        <AppProvider
          i18n={{
            Polaris: {
              Avatar: {
                label: 'Avatar',
                labelWithInitials: 'Avatar with initials {initials}',
              },
              ContextualSaveBar: {
                save: 'Save',
                discard: 'Discard',
              },
              TextField: {
                characterCount: '{count} characters',
              },
              TopBar: {
                toggleMenuLabel: 'Toggle menu',
  
                // SearchField: {
                //   clearButtonLabel: 'Clear',
                //   search: 'Search',
                // },
              },
              Modal: {
                iFrameTitle: 'body markup',
              },
              Frame: {
                skipToContent: 'Skip to content',
                navigationLabel: 'Navigation',
                Navigation: {
                  closeMobileNavigationLabel: 'Close navigation',
                },
              },
            },
          }}
        >
          <Frame
            logo={logo}
            topBar={topBarMarkup}
            navigation={navigationMarkup}
            showMobileNavigation={mobileNavigationActive}
            onNavigationDismiss={toggleMobileNavigationActive}
            skipToContentTarget={skipToContentRef.current}
          >
            {loadingMarkup}
            <Alert value={customers.length} />
            <Routes pages={pages} count={customers} billing = {billing} />
            {toastMarkup}
            {modalMarkup}
          </Frame>
        </AppProvider>
      </div>
    );
  }
  