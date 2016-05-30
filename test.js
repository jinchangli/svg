// 最佳整数
int LJF::BestInteger(double x)
{
  static const integer bs[38] =
  {
    1,2,5,10,20,25,50,100,200,250,500,1000,2000,2500,5000,10000,20000,
    25000,50000,100000,200000,250000,500000,1000000,2000000,2500000,
    5000000,10000000,20000000,25000000,50000000,100000000,200000000,
    250000000LL,500000000LL,1000000000LL,2000000000LL,2500000000LL
  };
  if (x > 0)
  {
    int
      start = 0,
      end = sizeof(bs)/sizeof(bs[0])-1;
    int i = FloorToInt(x);
    if (i <= bs[start])
      return (int) bs[start];
    if (i >= bs[end])
      return (int)bs[end];
    while (start < end-1) // 二分搜索
    {
      int w = (start+end)/2;
      if (i > bs[w])
        start = w;
      else if (i < bs[w])
        end = w;
      else
        return (int)bs[w];
    }
    return (int)bs[start];
  }
  else if (x < 0)
    return -BestInteger(-x);
  return 0;
}

// 最佳值
double LJF::BestNumber(double x)
{
  if (x > 0)
  {
    double t = Log10(x);
    int n = FloorToInt(t);
    x = Pow(10.0,t-n);
    if (x >= 5)
      x = 5;
    else if (x >= 2)
      x = 2;
    else
      x = 1;
    return x*Power(10.0,n);
  }
  else if (x < 0)
    return -BestNumber(-x);
  return 0;
}
