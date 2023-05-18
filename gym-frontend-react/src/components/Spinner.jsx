export default function Spinner() {
  return (
    <div className="flex justify-center my-16">
      <div className="radial-progress text-info animate-spin" style={{ "--value": 70 }}></div>
    </div>
  );
}
