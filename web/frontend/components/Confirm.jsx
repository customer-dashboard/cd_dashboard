import {Button, Modal, Spinner} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';

export default function Confirm(props) {
const {name,handleFunction, activeConfirm}=props;
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
const handleChange = useCallback(() => setActive(!active), [active]);
const activator = <Button onClick={handleChange}>{name}</Button>;
const successFunction = () =>{
    setLoading(true);
    handleFunction(true);
    }

    useEffect(() => {
    if(activeConfirm===false){
      setActive(activeConfirm);
      setLoading(false);
    }
    },[activeConfirm])
    
    const cancelFunction = () =>{
        setActive(false);
        setLoading(false)
    }
  return (
      <Modal
        activator={activator}
        open={active}
        onClose={handleChange}
        title="Reset All Setting"
        primaryAction={{
        loading: loading ? <Spinner accessibilityLabel="Small spinner example" size="small" /> : null,
        content: 'Reset',
        onAction: successFunction,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: cancelFunction,
          },
        ]}
      >
      </Modal>
  );
}