using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;

namespace GCGWebAPI
{
    [StructLayout(LayoutKind.Sequential)]
    public struct TFault2
    {
        public int Na, Nb;
        public IntPtr FaultA, FaultB;
        public bool Inverse;
    };

    [StructLayout(LayoutKind.Sequential)]
    public struct TPoint3D
    {
        public double X, Y, Z;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct TPoint2D
    {
        public double X, Y;
    }

    public class Wrapper
    {
        [DllImport("GeoGrids.dll", EntryPoint = "GenTin_MinArea", CharSet = CharSet.Ansi)]
        public extern static IntPtr GenTin_MinArea(int nPoints, TPoint3D[] pPoints, int nFault2s, TFault2[] pFault2s, int nBPoints, TPoint2D[] pBPoints, double iso_step, int ndecs);


        public static string GetJson()
        {
            var pPoints = new TPoint3D[12];
            pPoints[0].X = 20;
            pPoints[0].Y = 20;
            pPoints[0].Z = 30;

            pPoints[1].X = 40;
            pPoints[1].Y = 40;
            pPoints[1].Z = 60;

            pPoints[2].X = 80;
            pPoints[2].Y = 80;
            pPoints[2].Z = 70;

            pPoints[3].X = 120;
            pPoints[3].Y = 220;
            pPoints[3].Z = 130;



            TFault2[] rs = new TFault2[1];

            rs[0].Inverse = true;
            var FaultAArray = new double[3] { 1.222, 2.3333, 3.665 };
            var FaultBArray = new double[3] { 3.222, 4.3333, 5.232 };

            rs[0].FaultA = ConvertToIntPtr(FaultAArray);
            rs[0].FaultB = ConvertToIntPtr(FaultBArray);

            char[] text = new char[100000];

            //Console.WriteLine("任意键继续:");
            //Console.ReadKey();
            // IntPtr ptr = MarshalByRefObject 
            var result = Wrapper.GenTin_MinArea(4, pPoints, 1, rs, 0, null, 10, 3);

            string str = Marshal.PtrToStringAnsi(result);


            return str;
        }

        static IntPtr ConvertToIntPtr(double[] array)
        {
            if (array == null || array.Length == 0)
            {
                return IntPtr.Zero;
            }

            IntPtr ptr = Marshal.AllocHGlobal(sizeof(double) * array.Length);
            Marshal.Copy(array, 0, ptr, array.Length);

            return ptr;
        }
    }
}