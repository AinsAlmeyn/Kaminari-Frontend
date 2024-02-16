// import React, { useState, useRef, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Form, {
//   Item,
//   Label,
//   ButtonItem,
//   ButtonOptions,
//   RequiredRule,
//   EmailRule
// } from 'devextreme-react/form';
// import LoadIndicator from 'devextreme-react/load-indicator';
// import notify from 'devextreme/ui/notify';
// import { useAuth } from '../../contexts/auth';

// import './LoginForm.scss';

// export default function LoginForm() {
//   const navigate = useNavigate();
//   const { signIn } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const formData = useRef({ email: '', password: '' });

//   const onSubmit = useCallback(async (e) => {
//     e.preventDefault();
//     const { email, password } = formData.current;
//     setLoading(true);

//     const result = await signIn(email, password);
//     if (!result.isOk) {
//       setLoading(false);
//       notify(result.message, 'error', 2000);
//     }
//   }, [signIn]);

//   const onCreateAccountClick = useCallback(() => {
//     navigate('/create-account');
//   }, [navigate]);

//   return (
//     <form className={'login-form'} onSubmit={onSubmit}>
//       <Form formData={formData.current} disabled={loading}>
//         <Item
//           dataField={'email'}
//           editorType={'dxTextBox'}
//           editorOptions={emailEditorOptions}
//         >
//           <RequiredRule message="Email is required" />
//           <EmailRule message="Email is invalid" />
//           <Label visible={false} />
//         </Item>
//         <Item
//           dataField={'password'}
//           editorType={'dxTextBox'}
//           editorOptions={passwordEditorOptions}
//         >
//           <RequiredRule message="Password is required" />
//           <Label visible={false} />
//         </Item>
//         <ButtonItem>
//           <ButtonOptions
//             width={'100%'}
//             type={'default'}
//             useSubmitBehavior={true}
//           >
//             <span className="dx-button-text">
//               {
//                 loading
//                   ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
//                   : 'Sign In'
//               }
//             </span>
//           </ButtonOptions>
//         </ButtonItem>
//         {/* <Item>
//           <div className={'link'}>
//             <Link to={'/reset-password'}>Forgot password?</Link>
//           </div>
//         </Item> */}
//         <ButtonItem>
//           <ButtonOptions
//             text={'Create an account'}
//             width={'100%'}
//             onClick={onCreateAccountClick}
//           />
//         </ButtonItem>
//       </Form>
//     </form>
//   );
// }

// const emailEditorOptions = { stylingMode: 'filled', placeholder: 'User Name', mode: 'text' };
// const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };


import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
  CustomRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import { useAuth } from '../../contexts/auth';
import './LoginForm.scss';

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const formData = useRef({ email: '', password: '' });

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = formData.current;
    setLoading(true);

    const result = await signIn(email, password);
    setLoading(false);
    if (!result.isOk) {
      notify(result.message, 'error', 2000);
    } else {
      navigate('/dashboard'); // Assuming you have a dashboard to navigate after successful login
    }
  }, [signIn, navigate]);

  const onCreateAccountClick = useCallback(() => {
    navigate('/create-account');
  }, [navigate]);

  const lengthRule = (min, max) => ({
    message: `Please enter a value between ${min} and ${max} characters long.`,
    validationCallback: ({ value }) => value && value.length >= min && value.length <= max
  });

  return (
    <form className={'login-form'} onSubmit={onSubmit}>
      <Form formData={formData.current} disabled={loading}>
        <Item
          dataField={'email'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="User Name is required" />
          <CustomRule {...lengthRule(8, 30)} />
          <Label visible={false} />
        </Item>
        <Item
          dataField={'password'}
          editorType={'dxTextBox'}
          editorOptions={passwordEditorOptions}
        >
          <RequiredRule message="Password is required" />
          <CustomRule {...lengthRule(8, 30)} />
          <Label visible={false} />
        </Item>
        <ButtonItem>
          <ButtonOptions
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
          >
            <span className="dx-button-text">
              {
                loading
                  ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                  : 'Sign In'
              }
            </span>
          </ButtonOptions>
        </ButtonItem>
        <ButtonItem>
          <ButtonOptions
            text={'Create an account'}
            width={'100%'}
            onClick={onCreateAccountClick}
          />
        </ButtonItem>
      </Form>
    </form>
  );
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'User Name', mode: 'text' };
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' };
