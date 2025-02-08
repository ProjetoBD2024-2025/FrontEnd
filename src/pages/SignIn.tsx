import Player from "lottie-react";
import animationData from "../assets/animation.json";

export function SignIn() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center relative">
        <svg
          className="waves absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path fill="#ffff0b76" fillOpacity="1" d="M0,192L0,128L160,128L160,224L320,224L320,64L480,64L480,128L640,128L640,0L800,0L800,288L960,288L960,320L1120,320L1120,160L1280,160L1280,32L1440,32L1440,320L1280,320L1280,320L1120,320L1120,320L960,320L960,320L800,320L800,320L640,320L640,320L480,320L480,320L320,320L320,320L160,320L160,320L0,320L0,320Z"></path>
          <path fill="#273036" fillOpacity="0.5" d="M0,0L0,160L62.6,160L62.6,224L125.2,224L125.2,256L187.8,256L187.8,256L250.4,256L250.4,224L313,224L313,128L375.7,128L375.7,320L438.3,320L438.3,96L500.9,96L500.9,0L563.5,0L563.5,256L626.1,256L626.1,160L688.7,160L688.7,96L751.3,96L751.3,64L813.9,64L813.9,160L876.5,160L876.5,224L939.1,224L939.1,160L1001.7,160L1001.7,224L1064.3,224L1064.3,128L1127,128L1127,0L1189.6,0L1189.6,288L1252.2,288L1252.2,224L1314.8,224L1314.8,64L1377.4,64L1377.4,64L1440,64L1440,320L1377.4,320L1377.4,320L1314.8,320L1314.8,320L1252.2,320L1252.2,320L1189.6,320L1189.6,320L1127,320L1127,320L1064.3,320L1064.3,320L1001.7,320L1001.7,320L939.1,320L939.1,320L876.5,320L876.5,320L813.9,320L813.9,320L751.3,320L751.3,320L688.7,320L688.7,320L626.1,320L626.1,320L563.5,320L563.5,320L500.9,320L500.9,320L438.3,320L438.3,320L375.7,320L375.7,320L313,320L313,320L250.4,320L250.4,320L187.8,320L187.8,320L125.2,320L125.2,320L62.6,320L62.6,320L0,320L0,320Z"></path>
          <path fill="#273036" fillOpacity="0.9" d="M0,192L0,128L90,128L90,288L180,288L180,64L270,64L270,192L360,192L360,192L450,192L450,224L540,224L540,64L630,64L630,160L720,160L720,96L810,96L810,128L900,128L900,160L990,160L990,96L1080,96L1080,288L1170,288L1170,256L1260,256L1260,192L1350,192L1350,128L1440,128L1440,320L1350,320L1350,320L1260,320L1260,320L1170,320L1170,320L1080,320L1080,320L990,320L990,320L900,320L900,320L810,320L810,320L720,320L720,320L630,320L630,320L540,320L540,320L450,320L450,320L360,320L360,320L270,320L270,320L180,320L180,320L90,320L90,320L0,320L0,320Z"></path>

        </svg>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign in</h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Example@project.mail"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="*******"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}