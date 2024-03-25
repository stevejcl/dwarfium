import { statusCodes, apiCodes } from "../../data/dwarfii_codes";

type PropType = {
  message: any;
};

export default function LogMessageItem(props: PropType) {
  const { message } = props;

  function renderMetadata() {
    let action = apiCodes[message.cmd as keyof typeof apiCodes];
    let description = "";
    if (message.data && message.data.code)
      description = statusCodes[message.data.code as keyof typeof statusCodes];
    if (description && action) {
      return (
        <div>
          {action}: {description}
        </div>
      );
    } else if (description) {
      return <div>{description}</div>;
    } else if (action) {
      return <div>{action}</div>;
    } else if (message) {
      return <div>??? unknown </div>;
    }
  }

  return (
    <div className="card mt-3">
      <div className="card-header">{renderMetadata()}</div>
      <div className="card-body">
        <pre>{JSON.stringify(message, null, 2)}</pre>
      </div>
    </div>
  );
}
