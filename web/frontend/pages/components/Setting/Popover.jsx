import {useState } from 'react'
import {Popover, ColorPicker, TextField, FormLayout, DescriptionList,} from '@shopify/polaris'
export const PopoverSetting = (props) => {
  const {cd_title,ColorChange,value} = props;
  const ShopifyAdmin = { r: 28, g: 34, b: 96 };
  const MINIMUM_DIFFERENCE = 100;
const [popoverActive, setPopoverActive] = useState(false);
const [first, setfirst] = useState(value);
const [toggle, setToggle] = useState(false);
const togglePopoverActive = () =>{
  setToggle(true)
  setPopoverActive(!popoverActive);
}
    const [state, setState] = useState({
      color: {
        hue: 100,
        brightness: 1,
        saturation: 1
      },
      invalidHex: undefined,
      focusHex: null,
      focusColor: null
    });

    


const { color } = state;
const { hue, brightness, saturation } = color;
const rgb = hsbToRgb(hue / 360, saturation, brightness);
const { r, g, b } = rgb;
const hex = rgbToHex(r, g, b);
const diff = calcColorDifference(ShopifyAdmin, rgb);
const isOkay = isColorOkay(diff);
const error = isOkay ? null : "Color is not okay";

const divStyle = {
  width: "60px",
  height: "20px",
  backgroundColor: hex,
  borderRadius: "3px 3px 3px 3px"
};

  
  
const handleColorChange = color => {
const { hue, brightness, saturation } = color;
const rgb = hsbToRgb(hue / 360, saturation, brightness);
const { r, g, b } = rgb;
const hex = rgbToHex(r, g, b);
  setState({
    color,
    invalidHex: undefined,
    focusColor: true,
    focusHex: null
  });
  setfirst(hex)
  ColorChange({[cd_title]:hex});
};


const handleHexChange = hex => {
  const rgb = hexToRgb(hex);
  if (rgb == null) {
    setState({ invalidHex: hex, focusColor: null, focusHex: true });
    return;
  }
  // const color = rgbToHsv(rgb);
  // setState({
  //   color,
  //   invalidHex: undefined,
  //   focusColor: null,
  //   focusHex: true
  // });
};

return (
<div>
<Popover
active={popoverActive}
activator={toggle?<div className='color_picker' style={{backgroundColor:first}} onClick={togglePopoverActive}></div>:<div className='color_picker' style={{backgroundColor:value}} onClick={togglePopoverActive}></div>}
onClose={togglePopoverActive}
ariaHaspopup={false}
sectioned
>

<FormLayout>
        <ColorPicker
          onChange={handleColorChange}
          color={color}
          autoFocus={state.focusColor}
        />
        <DescriptionList
          items={[
            {
              term: "Your color",
              description: (
                <TextField
                  label="Your color"
                  labelHidden
                  disabled 
                  onChange={handleHexChange}
                  value={state.invalidHex || hex}
                  error={error}
                  prefix={<div style={divStyle} />}
                  autoFocus={state.focusHex}
                />
              )
            },
  
          ]}
        />
      </FormLayout>
</Popover>
</div>
);
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hsbToRgb(h, s, v) {
  let r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function calcColorDifference(c1, c2) {
  return Math.sqrt(
    Math.pow(c2.r - c1.r, 2) +
    Math.pow(c2.g - c1.g, 2) +
    Math.pow(c2.b - c1.b, 2)
  );
}

function isColorOkay(colorDiff) {
  return colorDiff > MINIMUM_DIFFERENCE;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : null;
}

function rgbToHsv(r, g, b) {
  if (arguments.length === 1) {
    (g = r.g), (b = r.b), (r = r.r);
  }
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min,
    h,
    s = max === 0 ? 0 : d / max,
    v = max / 255;

  switch (max) {
    case min:
      h = 0;
      break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);
      h /= 6 * d;
      break;
    case g:
      h = b - r + d * 2;
      h /= 6 * d;
      break;
    case b:
      h = r - g + d * 4;
      h /= 6 * d;
      break;
  }

  return {
    hue: h * 360,
    saturation: s,
    brightness: v
  };
}
}