function Validator(options) {
  const formSelector = document.querySelector(options.selector);
  let rules = options.rules;
  function handleShowValidate(inputSelector, message) {
    let parentInput = inputSelector.closest('.form-group');
    let errorMes = parentInput.querySelector(options.errorSelector);
    if (message) {
      errorMes.innerText = message;
    } else {
      errorMes.innerText = '';
    }
  }
  if (formSelector) {
    // xử lí validate khi blur input
    rules.forEach((rule) => {
      let inputSelector = formSelector.querySelector(rule.selector);
      console.log(rule.selector);
      inputSelector.onblur = (e) => {
        let value = e.target.value;
        let message = rule.test(value);
        handleShowValidate(inputSelector, message);
      };
    });
    //xử lí validate khi input
    rules.forEach((rule) => {
      let inputSelector = formSelector.querySelector(rule.selector);
      inputSelector.oninput = () => {
        handleShowValidate(inputSelector, '');
        let ref = inputSelector.getAttribute('ref');
        if (ref) {
          let refSelector = formSelector.querySelector(ref);
          let isMatched = inputSelector.value === refSelector.value;
          if (!isMatched) {
            handleShowValidate(refSelector, 'Giá trị không trùng nhau');
          } else {
            handleShowValidate(refSelector, '');
          }
        }
      };
    });
    // xử lí validate khi submit form
    formSelector.onsubmit = (e) => {
      e.preventDefault();
      let isError = false;
      rules.forEach((rule) => {
        let inputSelector = formSelector.querySelector(rule.selector);
        let value = inputSelector.value;
        let message = rule.test(value);
        if (message) isError = true;
        handleShowValidate(inputSelector, message);
      });
      if (!isError) {
        if (typeof options.submit === 'function') {
          let inputs = formSelector.querySelectorAll('[name]');
          let dataAllInputs = Array.from(inputs).reduce((values, input) => {
            switch (input.type) {
              case 'checkbox':
                if (!input.matches(':checked')) {
                  values[input.name] = '';
                  return values;
                }
                if (!Array.isArray(values[input.name])) values[input.name] = [];
                values[input.name].push(input.value);
                break;
              case 'radio': {
                let inputChecked = formSelector.querySelector(`input[name=${input.name}]:checked`);
                if (inputChecked) {
                  values[inputChecked.name] = inputChecked.value;
                } else values[input.name] = '';
                break;
              }
              case 'file': {
                values[input.name] = input.files;
                break;
              }
              default:
                values[input.name] = input.value;
            }

            return values;
          }, {});
          options.submit(dataAllInputs);
        } else {
          formSelector.submit();
        }
      }
    };
  }
}
Validator.minLength = (selector, minLength) => {
  return {
    selector,
    test(value) {
      return value.length >= minLength ? undefined : `Độ dài tối thiểu ${minLength} ký tự`;
    }
  };
};
Validator.isEmail = (selector) => {
  return {
    selector,
    test(value) {
      const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regexEmail.test(value) ? undefined : 'Không đúng định dạng Email';
    }
  };
};
Validator.confirmSelector = (selector, confirm) => {
  return {
    selector,
    test: (value) => {
      return value === confirm().value ? undefined : 'Giá trị không trùng nhau';
    }
  };
};
