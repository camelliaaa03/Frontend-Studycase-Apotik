import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
  } from "@material-tailwind/react";
  import { Link } from "react-router-dom";
  
  export function Management() {
    return (
      <div className="mt-8 mb-8 flex flex-col gap-12">
        <div class="basis-1/2 hover:basis-1/2">
        <Link to="/form/user"><Button>Tambah Data</Button></Link>
        </div>
        
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-5 p-4">
            <Typography variant="h6" color="white">
              Management User
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["No", "ID User", "Email", "Username", "Password", ""].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </CardBody>
        </Card>
      </div>
    );
  }
  export default Management;
  