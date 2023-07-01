import {useState} from 'react';
import {Card, CardBody, Typography, Button} from '@material-tailwind/react';

export function User () {
  const [id, setId] = useState ('');
  const [name, setName] = useState ('');
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');

  const handleSubmit = e => {
    e.preventDefault ();
    console.log ({id, name, email, password});
  };

  const handleCancel = () => {
    setId ('');
    setName ('');
    setEmail ('');
    setPassword ('');
  };

  return (
    <div className="mt-6 mb-8 flex flex-col gap-12">
      <Card>
        <CardBody>
          <Typography variant="h5" color="gray" className="mt-1 font-normal">
            Lengkapi Data
          </Typography>
          <br />
          <form onSubmit={handleSubmit}>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="id"
              >
                ID User
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="id"
                type="text"
                placeholder="ID User"
                value={id}
                onChange={e => setId (e.target.value)}
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="name"
              >
                Name
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName (e.target.value)}
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                Email
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={e => setEmail (e.target.value)}
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id="password"
                type="text"
                placeholder="password"
                value={password}
                onChange={e => setPassword (e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-4 grid-cols-2 basis-1/2 hover:basis-1/2">
              <div>
                <Button
                  type="button"
                  color="gray"
                  ripple="light"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button type="submit">Simpan</Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
