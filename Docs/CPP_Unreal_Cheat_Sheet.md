# C++ / Unreal Engine Syntax Cheat Sheet

Quick reference for the syntax used in this plugin. Each section shows **standard C++** first,
then the **Unreal** way (which is what you should use inside `VertexAnimToolset`).

---

## 1. Variables & Types

| Concept        | Standard C++                | Unreal                                  |
|----------------|-----------------------------|-----------------------------------------|
| Integer        | `int x = 5;`                | `int32 X = 5;` (`uint8`, `int64`, ...)  |
| Float          | `float f = 1.5f;`           | `float F = 1.5f;` / `double`            |
| Bool           | `bool b = true;`            | `bool bIsActive = true;` (prefix `b`)   |
| String         | `std::string s = "hi";`     | `FString S = TEXT("hi");`               |
| Name / ID      | —                           | `FName N = TEXT("Bone_01");` (fast compare) |
| UI text        | —                           | `FText T = FText::FromString(S);` (localizable) |
| Auto type      | `auto v = 3.0;`             | `auto V = 3.0;` (same)                  |
| Constant       | `const int MAX = 10;`       | `constexpr int32 MaxBones = 10;`        |
| Reference      | `int& r = x;`               | same                                    |
| Pointer        | `int* p = &x;`              | same; `nullptr` for null                |

Naming conventions in Unreal: `U` = UObject, `A` = Actor, `F` = struct/plain class,
`T` = template, `E` = enum, `I` = interface, `b` = bool.

---

## 2. Conditions

```cpp
// if / else if / else
if (Count > 0)            { ... }
else if (Count == 0)      { ... }
else                      { ... }

// Ternary
int32 Abs = (X < 0) ? -X : X;

// Logical ops:  &&  ||  !       Comparison:  ==  !=  <  <=  >  >=

// Null / validity checks
if (Ptr)                         { ... }   // raw pointer not null
if (IsValid(MyUObject))          { ... }   // UObject not null AND not pending kill
if (WeakPtr.IsValid())           { ... }   // TWeakObjectPtr / TSharedPtr
if (Str.IsEmpty())               { ... }   // FString
if (Arr.Num() == 0)              { ... }   // TArray  (or Arr.IsEmpty())

// If with initializer (C++17)
if (int32* Found = Map.Find(Key)) { Use(*Found); }

// switch
switch (Mode)
{
    case EVertexAnimMode::Static:  DoA(); break;
    case EVertexAnimMode::Skinned: DoB(); break;
    default:                       break;
}

// Floating-point compare — never use == on floats
if (FMath::IsNearlyEqual(A, B, KINDA_SMALL_NUMBER)) { ... }
if (FMath::IsNearlyZero(A)) { ... }
if (V1.Equals(V2, 0.001f))  { ... }   // FVector
```

---

## 3. Loops

```cpp
// Classic for
for (int32 i = 0; i < N; ++i) { ... }

// Reverse (safe when removing elements)
for (int32 i = Arr.Num() - 1; i >= 0; --i) { ... }

// Range-based for (read-only / by reference / modify)
for (const FVector& V : Verts) { ... }
for (FVector& V : Verts)       { V *= 2.f; }

// Index-based over a TArray
for (int32 i = 0; i < Verts.Num(); ++i) { Verts[i].Z = 0.f; }

// TMap iteration
for (const TPair<FName, int32>& Pair : Map) { Pair.Key; Pair.Value; }
for (auto& [Key, Value] : Map)               { ... }   // C++17 structured binding

// TSet iteration
for (const FName& Item : Set) { ... }

// Iterator with removal
for (auto It = Arr.CreateIterator(); It; ++It)
{
    if (ShouldRemove(*It)) { It.RemoveCurrent(); }
}
for (auto It = Map.CreateIterator(); It; ++It)
{
    if (It.Value() < 0) { It.RemoveCurrent(); }
}

// while / do-while
while (Cond) { ... }
do { ... } while (Cond);

// Loop control:  break;  continue;

// Nested loop over a 2D grid (e.g. texture pixels)
for (int32 Y = 0; Y < Height; ++Y)
for (int32 X = 0; X < Width;  ++X)
{
    const int32 Index = Y * Width + X;
}

// Parallel loop (Unreal)  #include "Async/ParallelFor.h"
ParallelFor(Verts.Num(), [&](int32 i) { Verts[i] = Transform(Verts[i]); });
```

---

## 4. Data Structures

### Dynamic array — `std::vector`  →  `TArray`

```cpp
TArray<int32> Arr;                 // empty
TArray<int32> Arr = {1, 2, 3};     // initializer list
Arr.Reserve(100);                  // pre-allocate
Arr.SetNum(10);                    // resize (default-init new)
Arr.SetNumZeroed(10);              // resize + zero
Arr.Init(0, 10);                   // 10 copies of 0

Arr.Add(4);                        // push back, returns index
Arr.Emplace(4);                    // construct in place
Arr.AddUnique(4);                  // only if not present
Arr.Insert(9, 0);                  // insert value at index 0
Arr.Append(OtherArr);              // concat

Arr[0];  Arr.Last();  Arr.Top();   // access
Arr.Num();                         // size
Arr.IsValidIndex(i);               // bounds check

Arr.Contains(4);
int32 Idx = Arr.Find(4);           // INDEX_NONE (-1) if missing
Arr.IndexOfByKey(4);

Arr.Remove(4);                     // remove ALL matching
Arr.RemoveSingle(4);
Arr.RemoveAt(0);
Arr.RemoveAtSwap(0);               // O(1), order not kept
Arr.Pop();                         // remove + return last
Arr.Empty();                       // clear (free memory)
Arr.Reset();                       // clear (keep memory)
```

### Hash map — `std::unordered_map`  →  `TMap`

```cpp
TMap<FName, int32> Map;
Map.Add(TEXT("Hip"), 0);           // insert / overwrite
Map.Emplace(TEXT("Knee"), 1);
Map[TEXT("Hip")] = 5;              // asserts if key missing!

int32* Ptr = Map.Find(TEXT("Hip"));          // nullptr if missing  ← safest
int32  Val = Map.FindRef(TEXT("Hip"));       // default value if missing
int32& Ref = Map.FindOrAdd(TEXT("Hip"));     // create if missing
bool   Has = Map.Contains(TEXT("Hip"));

Map.Remove(TEXT("Hip"));
Map.Num();  Map.Empty();

TArray<FName> Keys;   Map.GetKeys(Keys);
TArray<int32> Values; Map.GenerateValueArray(Values);
```

### Set — `std::unordered_set`  →  `TSet`

```cpp
TSet<int32> Set;
Set.Add(3);  Set.Remove(3);  Set.Contains(3);  Set.Num();
TSet<int32> U = A.Union(B);
TSet<int32> I = A.Intersect(B);
TSet<int32> D = A.Difference(B);
TArray<int32> AsArr = Set.Array();
```

### Others

| Standard C++               | Unreal                                  |
|----------------------------|-----------------------------------------|
| `std::pair<A,B>`           | `TPair<A,B>` (`.Key`, `.Value`)         |
| `std::tuple<A,B,C>`        | `TTuple<A,B,C>` / `MakeTuple(...)`      |
| `std::optional<T>`         | `TOptional<T>` (`.IsSet()`, `.GetValue()`) |
| `std::queue<T>`            | `TQueue<T>` (`Enqueue`, `Dequeue(Out)`) |
| `std::array<T,N>`          | `TStaticArray<T,N>` or `T Arr[N]`       |
| `std::function<R(Args)>`   | `TFunction<R(Args)>` / `TFunctionRef`   |
| `std::span`                | `TArrayView<T>` / `TConstArrayView<T>`  |
| Bitset                     | `TBitArray<>`                           |
| Ring buffer                | `TCircularBuffer<T>`                    |

### Strings — `FString`

```cpp
FString S = TEXT("Hello");
S += TEXT(" World");
S.Len();  S.IsEmpty();  S.ToUpper();  S.ToLower();
S.Contains(TEXT("World"));  S.StartsWith(TEXT("He"));  S.EndsWith(TEXT("ld"));
S.Find(TEXT("o"));          S.Replace(TEXT("o"), TEXT("0"));
S.Left(3);  S.Right(3);  S.Mid(1, 3);  S.TrimStartAndEnd();

TArray<FString> Parts;  S.ParseIntoArray(Parts, TEXT(","), true);
FString Joined = FString::Join(Parts, TEXT(", "));

FString F  = FString::Printf(TEXT("Frame %d / %.2f"), Frame, Time);   // format
FString I  = FString::FromInt(42);
FString Fl = FString::SanitizeFloat(3.14f);
int32  N   = FCString::Atoi(*S);      // string → int
float  X   = FCString::Atof(*S);      // string → float
const TCHAR* Raw = *S;                // FString → TCHAR* (for Printf / UE_LOG)

// Conversions
FName  Name = FName(*S);         FString FromName = Name.ToString();
FText  Txt  = FText::FromString(S);   FString FromTxt = Txt.ToString();
```

---

## 5. Functions & Lambdas

```cpp
// Declaration (.h)  /  definition (.cpp)
float Lerp(float A, float B, float T);
float Lerp(float A, float B, float T) { return A + (B - A) * T; }

// Pass large types by const ref, out-params by ref
void Process(const TArray<FVector>& In, TArray<FVector>& Out);

// Default args (header only)
void Bake(int32 Frames = 30, bool bNormals = true);

// Lambda:  [capture](params) -> ret { body }
auto Square = [](float X) { return X * X; };
int32 Count = 0;
auto Inc = [&Count]() { ++Count; };          // capture by reference
auto Copy = [=]() { return Count; };         // capture by value
auto This = [this]() { DoMember(); };        // capture this

// Template function
template<typename T>
T Clamp01(T V) { return FMath::Clamp(V, T(0), T(1)); }
```

---

## 6. Classes, Structs, Enums (Unreal reflection)

```cpp
// Enum
UENUM(BlueprintType)
enum class EBakeMode : uint8
{
    Static   UMETA(DisplayName = "Static"),
    Skinned  UMETA(DisplayName = "Skinned"),
};

// Struct
USTRUCT(BlueprintType)
struct FBakeSettings
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Bake")
    int32 NumFrames = 30;
};

// UObject class
UCLASS(BlueprintType)
class VERTEXANIMTOOLSET_API UMyProfile : public UObject
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "Profile")
    TArray<FBakeSettings> Settings;

    UFUNCTION(BlueprintCallable, Category = "Profile")
    void Bake();

    virtual void PostLoad() override;
};

// Creating objects
UMyProfile* P = NewObject<UMyProfile>(Outer);       // UObject
AActor*     A = GetWorld()->SpawnActor<AMyActor>(); // Actor
FBakeSettings S;                                    // plain struct (stack)
```

Common `UPROPERTY` specifiers: `EditAnywhere`, `EditDefaultsOnly`, `VisibleAnywhere`,
`BlueprintReadOnly`, `BlueprintReadWrite`, `Transient`, `meta=(ClampMin="0")`.

---

## 7. Pointers & Memory

| Use case                           | Type                         |
|------------------------------------|------------------------------|
| UObject member (GC-tracked)        | `UPROPERTY() TObjectPtr<UFoo> Foo;` |
| UObject, non-owning, may die       | `TWeakObjectPtr<UFoo>`       |
| Asset reference, load on demand    | `TSoftObjectPtr<UFoo>`       |
| Non-UObject, shared ownership      | `TSharedPtr<F>` / `MakeShared<F>()` |
| Non-UObject, must not be null      | `TSharedRef<F>`              |
| Non-UObject, unique ownership      | `TUniquePtr<F>` / `MakeUnique<F>()` |
| Observe a TSharedPtr               | `TWeakPtr<F>` → `.Pin()`     |

```cpp
// Casting UObjects
if (USkeletalMesh* SK = Cast<USkeletalMesh>(Obj)) { ... }   // nullptr on fail
USkeletalMesh* SK = CastChecked<USkeletalMesh>(Obj);        // asserts on fail
```

---

## 8. Common Algorithms

```cpp
#include "Algo/Sort.h"   // plus Algo/Find.h, Algo/Count.h, Algo/Reverse.h ...

// Sort
Arr.Sort();                                              // operator<
Arr.Sort([](const FVector& A, const FVector& B) { return A.Z < B.Z; });
Arr.StableSort(...);
Algo::Reverse(Arr);

// Find / filter with predicate
const FVector* Hit   = Arr.FindByPredicate([](const FVector& V){ return V.Z > 0; });
int32 Idx            = Arr.IndexOfByPredicate([](const FVector& V){ return V.Z > 0; });
TArray<FVector> Up   = Arr.FilterByPredicate([](const FVector& V){ return V.Z > 0; });
bool bAny            = Arr.ContainsByPredicate([](const FVector& V){ return V.Z > 0; });
Arr.RemoveAll([](const FVector& V){ return V.IsNearlyZero(); });

// Count / min / max / sum
int32 N  = Algo::CountIf(Arr, [](int32 X){ return X > 0; });
int32 Mx = FMath::Max(Arr);         // also FMath::Min(Arr)
int32 Sum = 0; for (int32 X : Arr) { Sum += X; }

// Transform (map)
TArray<float> Lens;
Algo::Transform(Verts, Lens, [](const FVector& V){ return V.Size(); });

// Bounding box of points
FBox Bounds(Verts);   FVector Size = Bounds.GetSize();

// Swap
Swap(A, B);
```

---

## 9. Math Formulae (FMath / FVector)

```cpp
FMath::Abs(x)   FMath::Sign(x)   FMath::Sqrt(x)   FMath::Pow(x, y)
FMath::Min(a,b) FMath::Max(a,b)  FMath::Clamp(x, Lo, Hi)
FMath::Lerp(A, B, T)                         // A + (B - A) * T
FMath::GetRangePct(Min, Max, V)              // (V - Min) / (Max - Min)   → inverse lerp
FMath::GetMappedRangeValueClamped(FVector2D(InMin,InMax), FVector2D(OutMin,OutMax), V)
FMath::Floor(x)  FMath::CeilToInt(x)  FMath::RoundToInt(x)  FMath::Frac(x)
FMath::DegreesToRadians(d)   FMath::RadiansToDegrees(r)
FMath::Sin / Cos / Atan2(Y, X)
FMath::RandRange(Min, Max)   FMath::FRand()

FVector V(1, 2, 3);
V.Size()            // length  √(x²+y²+z²)
V.SizeSquared()     // cheaper, for comparisons
V.GetSafeNormal()   // unit vector (zero-safe)
FVector::DotProduct(A, B)     // A | B
FVector::CrossProduct(A, B)   // A ^ B
FVector::Dist(A, B)           FVector::DistSquared(A, B)
FMath::VInterpTo(Cur, Target, DeltaTime, Speed)

// Transforms
FTransform T(Rotation, Translation, Scale);
FVector World = T.TransformPosition(Local);
FVector Local = T.InverseTransformPosition(World);
FVector Dir   = T.TransformVector(LocalDir);   // no translation

// Packing a value into 0..1 for a texture (common in VAT baking)
float Normalized = (Value - MinBound) / (MaxBound - MinBound);
float Unpacked   = Normalized * (MaxBound - MinBound) + MinBound;
```

---

## 10. Logging, Asserts & Debug

```cpp
UE_LOG(LogTemp, Log,     TEXT("Frames: %d"), NumFrames);
UE_LOG(LogTemp, Warning, TEXT("Mesh: %s"), *Mesh->GetName());
UE_LOG(LogTemp, Error,   TEXT("Pos: %s"), *V.ToString());

// Custom category:  .h  DECLARE_LOG_CATEGORY_EXTERN(LogVAT, Log, All);
//                   .cpp DEFINE_LOG_CATEGORY(LogVAT);

check(Ptr);                          // crash if false (dev builds)
checkf(i < N, TEXT("Bad i %d"), i);  // with message
ensure(Cond);                        // log + continue (once)
ensureMsgf(Cond, TEXT("..."));
verify(Expr);                        // like check but Expr runs in shipping too

GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, TEXT("Hi"));
DrawDebugSphere(GetWorld(), Pos, 10.f, 12, FColor::Red, false, 2.f);
```

Printf format specifiers: `%d` int, `%u` unsigned, `%f` / `%.2f` float, `%s` string (`*FString`),
`%lld` int64, `%p` pointer.

---

## 11. Editor-only Code & Module Basics

```cpp
#if WITH_EDITOR
    // editor-only code (e.g. inside VertexAnimToolsetEditor)
#endif

#if WITH_EDITORONLY_DATA
    UPROPERTY() int32 EditorOnlyValue;
#endif
```

`*.Build.cs` — add module dependencies:

```csharp
PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine" });
PrivateDependencyModuleNames.AddRange(new string[] { "UnrealEd", "RawMesh" });
```

---

## 12. Quick "How do I…?" Index

| I want to…                         | Write                                          |
|------------------------------------|------------------------------------------------|
| Loop N times                       | `for (int32 i = 0; i < N; ++i)`                |
| Loop over array                    | `for (const T& X : Arr)`                       |
| Loop over map                      | `for (auto& [K, V] : Map)`                     |
| Remove while looping               | reverse index loop, or `It.RemoveCurrent()`    |
| Check key exists & get value       | `if (T* P = Map.Find(K)) { ... }`              |
| Check UObject valid                | `if (IsValid(Obj))`                            |
| Safe cast                          | `if (UFoo* F = Cast<UFoo>(Obj))`               |
| Format a string                    | `FString::Printf(TEXT("%d"), N)`               |
| Compare floats                     | `FMath::IsNearlyEqual(A, B)`                   |
| Sort by field                      | `Arr.Sort([](auto& A, auto& B){ return A.X < B.X; });` |
| Remap a value to 0–1               | `FMath::GetRangePct(Min, Max, V)`              |
| Print to log                       | `UE_LOG(LogTemp, Log, TEXT("%s"), *S)`         |
