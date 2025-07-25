export const generateResetPasswordMJML = code => `
<mjml>
  <mj-body background-color="#ffffff" width="450px">
    <mj-section>
      <mj-column>
        <mj-text align="center" font-size="20px" font-weight="bold">Password reset</mj-text>
        <mj-divider border-color="#007bff" border-width="2px" />
        <mj-text align="center" font-size="16px">Use the code below to reset your password:</mj-text>
        <mj-text align="center" font-size="30px" font-weight="bold" color="#007bff">${code}</mj-text>
        <mj-text align="center" font-size="14px" color="#666">This code expires in 10 minutes.</mj-text>
        <mj-text align="center" font-size="12px" color="#999">
          If you have not requested this reset, please ignore this e-mail.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
